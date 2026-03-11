import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

// 환경변수 설정 (실행 전 수정 필요)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; 

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("환경변수를 설정해주세요:");
  console.error("  NEXT_PUBLIC_SUPABASE_URL: " + SUPABASE_URL);
  console.error("  SUPABASE_SERVICE_ROLE_KEY: " + SUPABASE_SERVICE_KEY);
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const BUCKET = "gallery";
const QUALITY = 100; // 압축 품질 (1-100)
const MAX_WIDTH = 800; // 최대 너비

async function main() {
  console.log("갤러리 이미지 목록 가져오는 중...");

  const { data: files, error } = await supabase.storage
    .from(BUCKET)
    .list("", { sortBy: { column: "name", order: "asc" } });

  if (error) {
    console.error("파일 목록 가져오기 실패:", error);
    return;
  }

  // 이미지 파일만 필터링 (_small 제외)
  const imageFiles = files.filter((file) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "");
    const isSmall = /_small\./i.test(file.name);
    return isImage && !isSmall;
  });

  console.log(`총 ${imageFiles.length}개 이미지 발견\n`);

  for (const file of imageFiles) {
    const ext = file.name.split(".").pop()?.toLowerCase();
    const baseName = file.name.replace(/\.[^.]+$/, "");
    const smallName = `${baseName}_small.${ext}`;

    console.log(`📥 ${file.name} 다운로드 중...`);

    // 이미지 다운로드
    const { data: downloadData, error: downloadError } = await supabase.storage
      .from(BUCKET)
      .download(file.name);

    if (downloadError) {
      console.error(`   ❌ 다운로드 실패:`, downloadError.message);
      continue;
    }

    try {
      const buffer = Buffer.from(await downloadData.arrayBuffer());
      const originalSizeKB = Math.round(buffer.length / 1024);
      
      let finalBuffer;
      let skipped = false;

      // 원본이 250KB 이하면 변환 생략
      if (buffer.length <= 250 * 1024) {
        finalBuffer = buffer;
        skipped = true;
        console.log(`📤 ${smallName} 업로드 중... (${originalSizeKB}KB - 원본 유지, 250KB 이하)`);
      } else {
        // 이미지 압축
        let sharpInstance = sharp(buffer).resize({
          width: MAX_WIDTH,
          withoutEnlargement: true,
        });

        // 포맷별 압축 설정
        if (ext === "png") {
          sharpInstance = sharpInstance.png({ quality: QUALITY });
        } else if (ext === "webp") {
          sharpInstance = sharpInstance.webp({ quality: QUALITY });
        } else {
          sharpInstance = sharpInstance.jpeg({ quality: QUALITY });
        }

        const compressedBuffer = await sharpInstance.toBuffer();
        const compressedSizeKB = Math.round(compressedBuffer.length / 1024);

        // 변환 결과가 원본보다 크면 원본 유지
        if (compressedBuffer.length >= buffer.length) {
          finalBuffer = buffer;
          skipped = true;
          console.log(`📤 ${smallName} 업로드 중... (${originalSizeKB}KB - 원본 유지, 압축본이 더 큼)`);
        } else {
          finalBuffer = compressedBuffer;
          console.log(`📤 ${smallName} 업로드 중... (${originalSizeKB}KB → ${compressedSizeKB}KB)`);
        }
      }

      // 업로드
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(smallName, finalBuffer, {
          contentType: `image/${ext === "jpg" ? "jpeg" : ext}`,
          upsert: true,
        });

      if (uploadError) {
        console.error(`   ❌ 업로드 실패:`, uploadError.message);
      } else {
        console.log(`   ✅ 완료\n`);
      }
    } catch (err) {
      console.error(`   ❌ 압축 실패:`, err.message);
    }
  }

  console.log("\n🎉 모든 작업 완료!");
}

main();
