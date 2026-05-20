SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: camping_guide; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."camping_guide" ("id", "sections", "updated_at") VALUES
	('65041e2c-b155-4e45-b2be-8bf124fc5a55', '[{"key": "time", "icon": "Clock", "notes": ["입장 전일에 예약이 없을 시 얼리체크인 가능 (문의필요)", "퇴장일에 예약이 없을시 레이트체크아웃 가능 (문의필요)"], "title": "시간 안내", "subsections": [{"title": "체크인", "content": "오후 2시 이후"}, {"title": "체크아웃", "content": "낮 12시 이전"}]}, {"key": "procedure", "icon": "ListChecks", "title": "주요 절차 및 시설", "subsections": [{"items": ["입구 관리동에서 체크인", "쓰레기 분리 수거봉투(2장)수령, 사이트및 주차위치 확인", "이용 중 쓰레기 분리 수거 및 퇴장 전 쓰레기(일반, 재황용, 음식물)분리 배출 (쓰레기 처리장)", "사이트 내 쓰레기 수거 및 깔판 정리정돈"], "title": "입 · 퇴장 절차"}, {"items": ["샤워장 · 탈의실 (4개소)", "개수대 · 화장실 (5개소)", "공용 수영장 (시즌 운영)"], "title": "공용 시설"}]}, {"key": "extra-fee", "icon": "PlusCircle", "items": ["조기 입장 이용료: 10,000원 (오후 1시 이전 입장 시)", "퇴장 연장 이용료: 3시간 연장 20,000원, 6시간 연장 25,000원", "카라반, 캠핑카, 트레일러 등 동반 이용 시 1박에 10,000원 추가 부과", "캠핑장 사이트 별 기준인원 초과 시 1인당 1박에 10,000원 추가 부과", "반려견 동반 이용 시 1마리당 1박에 5,000원 추가 부과"], "title": "추가 요금 안내", "footer": "문의 및 신청은 예약담당에게 전화 주세요. (010-9703-1711)"}, {"key": "pet", "icon": "PawPrint", "items": ["세퍼트, 진돗개 등 맹견 및 중대형견(10kg 이상)은 입장할 수 없습니다. (장애인 보조견 제외)", "사이트별 2마리로 제한합니다.", "모든 반려견은 반드시 목줄을 착용해야 합니다.", "편의시설(개수대, 샤워장, 화장실 등)에는 반려견 출입을 엄격히 금합니다."], "title": "반려견 동반 안내"}, {"key": "etc", "icon": "Info", "title": "기타 안내", "subsections": [{"title": "주차 안내", "content": "사이트별 지정 위치에 주차해야 합니다. 대부분 사이트 내 직접 주차가 가능하나, 일부 사이트는 짐을 내린 후 지정 장소로 이동해야 합니다."}, {"items": [{"label": "네트워크", "value": "SECLUB_1 / 2 / 3"}, {"label": "비밀번호", "value": "12345678"}], "title": "인터넷"}, {"items": [{"label": "관리실 (현장 문의)", "value": "010-4668-1704"}, {"label": "예약 담당", "value": "010-9703-1711"}], "title": "비상 연락처"}]}]', '2026-04-26 22:49:49.628844+00');


--
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."category" ("id", "created_at", "type") VALUES
	('370be224-6a7b-43bf-8c5c-6c6a4e7dc4f4', '2025-08-02 17:46:28.556505+00', '수상'),
	('563c74f0-5336-4c40-a1c0-aab3150cee60', '2025-08-02 17:46:37.879942+00', '공지'),
	('2d9093af-8a67-47b8-9ea6-8b078b80d3e9', '2025-08-02 17:46:47.855653+00', '이벤트');


--
-- Data for Name: discount_rates; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."discount_rates" ("id", "season", "category", "nights", "discount_percent") VALUES
	(1, 'highSeason', 'camping', '3박 이상', 0),
	(3, 'highSeason', 'camping', '5박 이상', 20),
	(4, 'highSeason', 'camping', '6박 이상', 25),
	(5, 'highSeason', 'camping', '7박 이상', 25),
	(6, 'highSeason', 'lodging', '3박 이상', 15),
	(7, 'highSeason', 'lodging', '4박 이상', 20),
	(8, 'highSeason', 'lodging', '5박 이상', 20),
	(9, 'highSeason', 'lodging', '6박 이상', 25),
	(10, 'highSeason', 'lodging', '7박 이상', 25),
	(11, 'winterSeason', 'general', '3박', 20),
	(12, 'winterSeason', 'general', '4박', 25),
	(13, 'winterSeason', 'general', '5박', 25),
	(14, 'winterSeason', 'general', '6박', 30),
	(15, 'winterSeason', 'general', '7박', 30),
	(16, 'winterSeason', 'general', '8박 이상', 35),
	(17, 'winterSeason', 'general', '2주 이상', 40),
	(18, 'winterSeason', 'general', '4주 이상', 50),
	(2, 'highSeason', 'camping', '4박 이상', 20);


--
-- Data for Name: gallery_reborn_items; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: room_rates; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."room_rates" ("id", "name", "type", "peak_rate", "winter_rate", "long_stay_discount", "display_order", "created_at", "updated_at") VALUES
	(1, '해수풀빌라', 'lodging', 359000, 289000, 30000, 1, '2026-03-26 05:51:17.435518', '2026-03-26 05:51:17.435518'),
	(2, '오션스파빌라', 'lodging', 399000, 349000, 30000, 2, '2026-03-26 05:51:17.435518', '2026-03-26 05:51:17.435518'),
	(3, '선셋 캠핑 하우스', 'lodging', 339000, 279000, 30000, 3, '2026-03-26 05:51:17.435518', '2026-03-26 05:51:17.435518'),
	(4, '오션 콘도 스탠다드', 'lodging', 199000, 169000, 20000, 4, '2026-03-26 05:51:17.435518', '2026-03-26 05:51:17.435518'),
	(6, '프리미엄 빌라', 'lodging', 1890000, 1490000, 100000, 6, '2026-03-26 05:51:17.435518', '2026-03-26 05:51:17.435518'),
	(7, '캠핑장/반려견캠핑장', 'camping', 65000, 55000, 5000, 10, '2026-03-26 05:51:17.435518', '2026-03-26 05:51:17.435518'),
	(8, 'S 사이트', 'camping', 75000, 65000, 5000, 11, '2026-03-26 05:51:17.435518', '2026-03-26 05:51:17.435518'),
	(5, '오션 콘도 디럭스', 'lodging', 289000, 249000, 25000, 5, '2026-03-26 05:51:17.435518', '2026-03-26 05:51:17.435518');


--
-- Data for Name: late_checkout_rates; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."late_checkout_rates" ("id", "room_id", "hours_3", "hours_6") VALUES
	(1, 1, 55000, 70000),
	(2, 2, 60000, 75000),
	(3, 3, 50000, 65000),
	(4, 4, 35000, 45000),
	(5, 5, 45000, 60000),
	(6, 7, 20000, 25000);


--
-- Data for Name: main_hero_text; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."main_hero_text" ("id", "tagline", "heading_line1", "heading_line2", "button_text", "updated_at", "notices_new_badge") VALUES
	('6bed6de6-32d4-4556-b2c6-decebb424c2d', '당신만의 힐링', 'SE Club에서 누리는', '완벽한 휴식', '지금 예약하기', '2026-04-30 09:01:27.238+00', true);


--
-- Data for Name: notice; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."notice" ("id", "created_at", "updated_at", "title", "content", "active", "images", "category", "view", "pinned") VALUES
	('5ebd1b5c-9809-40fe-972d-8cdbe31145c7', '2026-04-28 13:58:05.401983+00', '2026-05-20 07:57:02.335+00', 'SE 클럽 웰니스 프로그램 안내 ', '<p></p><img src="https://nqsogxcasyjauqgwmrxi.supabase.co/storage/v1/object/public/notice/5ebd1b5c-9809-40fe-972d-8cdbe31145c7/49a4d4d6-32dd-48b8-9b51-af5c8a8e3572.png" class="max-w-full h-auto rounded"><p></p>', true, NULL, '공지', 70, false),
	('d64be2e0-e61f-4f35-8399-6c48c6842841', '2025-09-08 23:54:54.183921+00', '2026-04-06 08:45:24.084+00', '신청 안내_ 서해 선셋 캠핑페스티벌 (2025.9.19.<금> ~ 9. 21.<일>)', '서해 선셋 캠핑페스티벌\n\n태안 로컬푸드 요리대회\n\n서해 선셋 다이닝\n\n​\n\n서해 바다 위로 펼쳐지는 붉은 석양, 그리고 지구를 위한 작은 실천\n\n친환경 캠핑 체험!\n\n음악공연, 다양한 이벤트, 캠핑브랜드 전시 등 특별한 추억을 만들어 보세요\n\n​\n\n주요프로그램\n\n-서해 선셋 다이닝 & 첼로 공연  \n\n-낙화놀이 &  쥐불놀이  \n\n-해루질 체험 & 태안 로컬푸드 요리대회  \n\n-버스킹 공연 & 천문대 별자리 체험  \n\n-플로깅\n\n​\n\n2박3일 캠핑\n\n행사일 : 2025.9.19.(금) ~ 21.(일)\n\n참가비 : 1사이트당 99,000원\n\n​\n\n서해 선셋 다이닝\n\n행사일 : 2025.9.20.(토)\n\n참가비 : 1인 2만원\n\n​\n\n신청주소\n\nhttps://sunsetcamping.notion.site/25bfce57826b80c8b394d612c70abdef\n\n\n장소\n\nSE클럽(태안둘레길캠핑장 & 펜션)\n\n\n"가을 서해 바다의 노을과 별빛이 어우러지는 태안에서 ‘서해 선셋 캠핑 페스티벌’이 개최된다. 이번 축제는 2025년 9월 19일부터 21일까지 3일간 태안 둘레길캠핑장에서 진행되는 행사이다. 축제는 친환경 캠핑을 주제로 하며 No Waste Clean Zone 운영을 통해 쓰레기 없는 캠핑을 실천하는 자리를 마련한다. 참가자는 친환경 캠핑 실천 공모전과 캠핑 브랜드 전시, 이벤트 등을 통해 자연 보존의 가치를 체험할 수 있다. 2박 3일 캠핑 참여자에게는 친환경 웰컴키트와 태안 로컬푸드 꾸러미가 제공된다. 주요 프로그램은 서해 노을을 배경으로 한 선셋 다이닝, 친환경 점화 낙화 체험, 로컬푸드 요리대회, 별자리 강연 및 관측, 공연과 버스킹 등으로 구성된다. 또한 가족 단위 참가자가 함께 즐길 수 있는 다양한 체험과 이벤트가 마련된다. 이 축제는 자연 보호와 지역 문화 체험을 동시에 경험할 수 있는 종합적인 캠핑 행사이다." 출처: 한국관광공사', true, '{https://nqsogxcasyjauqgwmrxi.supabase.co/storage/v1/object/public/notice/d64be2e0-e61f-4f35-8399-6c48c6842841/23c4a556-23d4-421f-a7f6-83bf93e7fe9f.jpg}', '이벤트', 154, false),
	('7fe8638a-b45d-46dc-ba9d-0b07402b1176', '2025-11-15 09:01:20.518537+00', '2025-11-15 09:55:34.18+00', '[SE클럽 공모전] 💙 사진 & 영상 공모전  [나만의 쉼] 💙 ', 'SE클럽 영상 & 사진 콘테스트 [나만의 쉼] \n“쉼은 감각이다. 나의 프리미엄 쉼을 담다.” \n \n[공모 주제]  \nSE클럽에서 발견한 “나만의 쉼표”를 표현해 주세요. 프라이빗 해변, 독채 숙소, 자연과 예술이 어우러진 공간에서 경험한 소중한 ‘쉼’의 순간들을 담아주세요.  \n\n[공모 분야]  숏폼/브이로그/광고영상/사진 등 자유롭게 선택   \n[공모 기간]  2025.11.15 (토) ~ 2025.1.31 (수) \n[지원 자격]  SE클럽을 방문한 누구나 \n[발표]  2026. 2.22 개별 연락 \n\n[공모 부문]\n-빌라 & 펜션 부문: 객실 중심의 영상 및 사진 \n-캠핑 부문: 캠핑 중심의 영상 및 사진 \n-힐링 & 아트 부문: 낙조, 별빛, 예술 작품과 어우러진 SE클럽의 전체의 감각적 풍경 \n \n[시상 내역 및 상품 ]\n총 17분을 선정, 프리미엄 빌라부터 캠핑 사이트까지 다양한 숙박권을 드립니다.  \n\n-대상 (통합): 1명, 200만원 상당의 프리미엄 빌라 숙박권 \n-공간의 쉼 (빌라/팬션) 부문: 2명, 해수풀빌라 숙박권 1명, 오션스파빌라 숙박권 1명 \n-자연의 쉼 (캠핑) 부문: 8명, SE클럽 캠핑 사이트 숙박권 \n-힐링 & 아트 부문: 1명, 선셋 캠핑하우스 숙박권 \n-인기상 (SNS) 부문: 5명, 오션 콘도 디럭스 (2명), 오션 콘도 스탠다드 (3명) \n                                *좋아요, 조회수, 댓글 등을 통합해 가장 인기가 많은 포스팅 선정 \n\n[참여 방법 ]\n1단계: SNS 업로드\n           개인 SNS(유튜브, 인스타그램, 틱톡, 블로그 등)에 업로드 (중복 가능) \n            필수 해시태그 3가지: #SE클럽 #SE클럽공모전 #나만의쉼 \n            추천 해시태그: #프라이빗독채펜션 #태안감성숙소 #럭셔리숙소#태안둘레길캠핑장 #선셋맛집 \n 2단계: 이메일 접수 seclub.taean@gmail.com \n            제목: [SE클럽 공모전]_(참가자이름)_출품부문_작품명 \n           본문: 참가자 이름 / 전화번호 / SNS 게시물 링크 기재  \n\n\n💙참여자 전용 숙박 10% 할인 혜택 💙\n \n콘텐츠 제작을 위해 SE클럽을 방문하시는 참가자분께 숙박비 10% 특별 할인 혜택을 드립니다. 할인은 아래 절차를 통해 적용됩니다. \n\n-1단계: 이메일 신청\n이메일 seclub.taean@gmail.com로 “공모전 참가희망(신청자 이름)”이라고 쓰고 SNS 주소를 보내주시면 회신으로 SE클럽이 제공하는 공모전 전용 홍보 이미지를 전달드립니다. \n-2단계: SNS 포스팅 업로드\n받은 이미지를 개인 SNS(인스타그램, 블로그, 틱톡 등)에 업로드하고 #SE클럽, #SECLUB, #태안둘레길캠핑장 #선셋맛집 태그를 포함해주세요. \n-3단계: 전화예약으로 할 받기\n전화 예약을 통해 신청자 이름을 알려주시면 10% 할인 혜택을 드립니다. \n*포스팅은 반드시 공개 설정이어야 하며, 삭제 시 할인 혜택이 취소됩니다. \n\n \n\n*유의사항 \n모든 숙박권·이용권은 현금 환불 및 교환 불가. 주말·성수기·공휴일 이용 가능하나 만실 시 대체일 협의. \n저작권 및 활용 동의: 응모작의 저작재산권은 SE클럽에 귀속되며, 수상작은 SE클럽의 홍보·마케팅·인쇄·온라인 등 모든 채널에서 별도의 대가 없이 활용될 수 있습니다. 참여 시 이에 동의한 것으로 간주됩니다. \n응모작에 사용되는 모든 자료(이미지, 폰트, 음원, 인물 등)는 법적인 문제가 없도록 응모자 본인이 직접 책임을 져야 합니다. \n\n[문의 ]\n이메일: seclub.taean@gmail.com \n \n\n ', false, '{https://nqsogxcasyjauqgwmrxi.supabase.co/storage/v1/object/public/notice/7fe8638a-b45d-46dc-ba9d-0b07402b1176/2163303b-d1e4-47cc-9f4b-f958093289b8.jpg}', '이벤트', 2, false),
	('e4d7b651-3f52-4c49-9fa4-abcdef123456', '2025-07-25 00:00:00+00', '2025-08-03 13:54:03.063+00', '8월 특별이벤트 ''별빛 아래 음악여행''', '8월에는 매 주말마다 SE클럽에서 라이브 공연을 진행하고 있습니다. 캠핑장의 아름다운 경관과 함께 예쁜 노래소리로 주말을 보내세요!\n\n- 일시: 8월 매주 금/토/일 저녁 7시\n- 장소: SE클럽 중앙 광장\n- 출연 가수: 매주 변경 (홈페이지 일정 확인)\n\n많은 참여 부탁드립니다.', true, NULL, '이벤트', 780, false),
	('7a5b8d2f-55f9-4fc4-8d68-4707ecd16a92', '2026-04-30 08:47:45.383726+00', '2026-05-20 05:14:11.659+00', '3만3천 평 태안 ''SE클럽'', 노엘라 협업으로 ''에코-아트 플랫폼'' 전환 본격화 융합아티스트 노엘라 비전 도입…자연·예술·교육 결합한 복합 문화공간으로 확장', '<h3><strong>3만3천 평 태안 ''SE클럽'', 노엘라 협업으로 ''에코-아트 플랫폼'' 전환 본격화</strong></h3><h2></h2><h2>융합아티스트 노엘라 비전 도입…자연·예술·교육 결합한 복합 문화공간으로 확장</h2><ul><li><p></p></li></ul><h3></h3><img src="https://cdn.eroun.net/news/photo/202604/78697_132564_2314.jpg" alt="밤하늘을 수놓은 SE클럽" class="max-w-full h-auto rounded"><h3>밤하늘을 수놓은 SE클럽<br></h3><h3></h3><h3>충남 태안 꾸지나무골 해변에 위치한 에코아트 리조트 SE클럽(SE CLUB)이 융합아티스트 노엘라와의 협업을 계기로 ‘에코-아트 플랫폼’으로의 전환을 본격화하고 있다.<br><br>2017년 조성을 시작으로 자연 친화형 리조트 기반을 구축해 온 SE클럽은 약 3만3천 평 부지에 3개 구역으로 구성된 하드비치형 전면 해변과 선셋 전망대 및 씨뷰 전망대, 118개의 캠핑 사이트와 28개의 프라이빗 빌라, 서해 낙조를 조망할 수 있는 인피니티풀을 갖춘 복합형 자연 리조트다.<br><br>최근 2026년 융합아티스트 노엘라가 비전 앤 필라소피(Vision &amp; Philosophy)를 맡으며 업사이클링 아트 프로그램을 도입했고, 숙소 기준 약 120~200명, 캠핑장을 포함할 경우 최대 약 800명 규모까지 수용 가능한 인프라를 바탕으로 기업 연수(B2B)와 프라이빗 휴양(B2C)을 아우르는 문화 플랫폼으로의 확장을 추진하고 있다.<br><br>2015년 자연형 리조트로 시작, 2026년 문화 플랫폼으로 확장<br><br>SE클럽은 2017년 자연 환경을 기반으로 한 체류형 리조트로 조성을 시작했으며, 이후 지속적으로 공간과 프로그램을 확장해 왔다. 특히 2026년, 융합아티스트 노엘라가 공간의 비전과 철학을 맡으면서 업사이클링 아트 프로그램이 본격적으로 도입됐고, 자연 중심의 공간 위에 예술과 교육이 더해지며 SE클럽은 ‘에코-아트 플랫폼’이라는 새로운 방향으로 진화하고 있다. 단순 휴식 공간을 넘어 감각과 사고를 확장하는 복합 문화공간으로의 전환이 이뤄지고 있다는 평가다.<br><br>플랫폼 전환의 핵심에는 상설 운영되는 업사이클링 아트 스튜디오가 있다. 이곳에서는 버려진 자원이 새로운 의미를 얻고, 손끝에서 하나의 예술로 재탄생한다. 방문객들은 자원의 순환과 환경의 가치를 직접 체험할 수 있으며, 필요 시 전문 강사와 함께하는 맞춤형 프로그램도 운영된다. 이를 통해 기업 고객에게는 ESG 기반 팀빌딩 프로그램으로, 가족 단위 방문객에게는 교육형 콘텐츠로 확장되고 있다.<br><br>비치코밍부터 독살 체험까지, 자연과 지역을 몸으로 배우는 시간<br><br>SE클럽은 자연 체험을 기반으로 한 프로그램을 통해 플랫폼의 외연을 넓히고 있다. 해변에서 빗질하듯 표류물이나 쓰레기를 주워 모으는 비치코밍(Beachcombing), 갯벌 체험, 태안 전통 어로 방식인 독살 체험 등이 운영되며, 관광을 넘어 자연과 지역의 가치를 이해하는 경험을 제공한다. 일부 활동은 환경 정화와 연계돼 교육 및 봉사활동 프로그램으로도 활용 가능하다.<br><br>SE클럽은 공간 전반을 예술 플랫폼으로 구성했다. 약 100여 점의 원화와 조형 작품이 리조트 곳곳과 숙소 내부에 배치돼 체류 자체가 문화 예술 경험으로 이어진다. 특히 ‘갤러리 속 세미나실’은 자연과 예술이 결합된 환경 속에서 회의와 교육이 이뤄지는 공간으로, 기업 연수 및 워크숍에서 차별화된 몰입도를 제공한다.<br><br>자연 환경 역시 플랫폼의 중요한 자산이다. 3개 구역으로 구성된 프라이빗 하드비치는 대규모 야외 활동과 팀빌딩 프로그램이 가능한 공간으로 활용되며, 숲과 바다를 잇는 약 1시간 코스의 ‘솔향기 트래킹’은 태안의 자연을 입체적으로 경험할 수 있도록 한다.<br><br>몸과 마음의 균형을 되찾는 시간<br><br>SE클럽은 웰니스 요소를 결합해 체류 경험을 확장하고 있다. 비치 요가, 명상, 싱잉볼 테라피 등은 자연 속에서 심신의 회복과 몰입을 돕는 프로그램으로 운영되며, 요가 매트와 싱잉볼 렌탈 서비스도 제공된다. 필요 시 전문 강사 연계 프로그램을 통해 개인부터 단체까지 다양한 수요를 수용할 수 있다.<br><br>SE클럽은 28개의 프라이빗 빌라와 118개의 캠핑 사이트를 기반으로 숙소 기준 약 120~200명, 최대 약 800명까지 수용 가능한 인프라를 갖추고 있다. 이는 기업 연수, 워크숍, 교육 프로그램, 대규모 행사 운영을 가능하게 하는 기반이다. 인피니티풀과 가족 수영장, 선셋·씨뷰 전망대 등은 공간의 상징성과 함께 방문객에게 정서적 경험을 제공한다.<br><br>노엘라가 직접 참여하는 프리미엄 강연 프로그램도 운영된다. 해당 프로그램은 예술적 경험을 기반으로 리더십과 창의적 사고를 확장하는 내용으로 구성되며, 기업 및 단체 맞춤형으로 기획이 가능하다.</h3><h3></h3><img src="https://cdn.eroun.net/news/photo/202604/78697_132565_2328.jpg" alt="3만3천평 부지의 SE클럽 전경" class="max-w-full h-auto rounded"><h3></h3><h3></h3><h3>신뢰를 만드는 운영의 힘<br><br>운영 측면에서는 신라호텔, 파크호텔, 가든호텔 등 특급호텔 출신 인력이 참여하는 객실 관리 체계를 통해 안정적인 숙박 환경을 유지하고 있다. 또한 유종현 대표는 30년 이상 교육기관 운영 경험을 바탕으로 기업 연수 및 교육 프로그램을 체계적으로 운영하고 있다.<br><br>SE클럽은 자연·예술·교육이 결합된 ‘에코-아트 플랫폼’을 통해 단순한 숙박 시설을 넘어 복합 문화공간으로의 성장을 추진하고 있다. 유종현 대표는 “창의적인 공간이 혁신적인 성과와 진정한 휴식을 만든다”며 “자연과 예술, 교육이 결합된 프로그램을 통해 방문객이 의미 있는 경험을 할 수 있는 공간으로 발전시켜 나가겠다”고 밝혔다.<br><br>SE클럽은 앞으로도 자연의 본질을 훼손하지 않으면서 예술적 감수성을 더한 프로그램을 지속적으로 확대해 나갈 계획이다. 태안의 자연 환경 위에 구축된 이 에코-아트 플랫폼이 향후 어떤 경험과 가치를 제시할지 주목된다.</h3><h3><br>이로운넷=김기호 기자</h3><h3><br>출처 : 이로운넷(<a target="_blank" rel="noopener noreferrer nofollow" href="https://www.eroun.net">https://www.eroun.net</a>)<br><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.eroun.net/news/articleView.html?idxno=78697">https://www.eroun.net/news/articleView.html?idxno=78697</a></h3><h3></h3><p></p>', true, NULL, '공지', 37, false),
	('f5e8c762-4a63-5d5a-afb5-fedcba654321', '2025-07-20 00:00:00+00', '2025-07-20 00:00:00+00', '📢 SE CLUB 새단장 안내 📢', '안녕하세요, SE CLUB을 찾아주시는 고객 여러분!\n더욱 편리하고 감각적인 경험을 선사하기 위해 웹사이트를 새롭게 단장했습니다.\n\n모던한 디자인 & 직관적 UI\n깔끔해진 레이아웃과 직관적인 메뉴 구조로 원하는 정보에 빠르게 접근할 수 있습니다.\n\n생생한 현장감의 갤러리\n프리미엄 빌라부터 캠핑 사이트까지, SE CLUB만의 아름다운 풍경을 고해상도 이미지로 만나보세요.\n\n모바일 최적화\n스마트폰·태블릿에서도 쾌적하게 이용할 수 있도록 반응형 웹으로 전면 개편했습니다.\n\n이벤트·프로모션\n시즌별 프로모션, 얼리버드 혜택 등 최신 소식을 한눈에 확인하세요.\n\n📬 소중한 의견을 들려주세요\n\n새로워진 웹사이트에 대한 느낀 점이나 개선 제안이 있으시면 언제든지 카페 혹은 저희에게 직접 문의주세요.\n\n앞으로도 SE CLUB과 함께 바다와 산, 별빛이 어우러진 특별한 순간을 즐겨보세요.\n감사합니다!\n\n– SE CLUB 드림 –', true, NULL, '공지', 867, false),
	('d3c6f54c-2e41-4b38-8e93-1234567890ab', '2022-10-21 00:00:00+00', '2022-10-21 00:00:00+00', '함께 축하해 주세요! SE클럽 ''한국경제를 빛낸 인물&경영'' 더블 수상', '함께 축하해 주세요!\n\nSE클럽(태안둘레길캠핑장)이 ''제 7회 2022년 한국경제를 빛낸 인물&경영'' 시상식에서 ''관광산업발전 유공(풀빌라 & 리조트 부문)'' 및 ''고객 만족경영 패밀리 리조트 브랜드'' 부문을 수상하였습니다.\n\n<취지및 목적>\n현재에 안주하지 않고 끊임없는 변화와 혁신으로 성과를 창출하여 각 분야 발전에 힘이 되는 경영인들을 선정하여 알림\n\n<시상 일시및 주최, 후원>\n* 일시 및 장소: 2022년 10월 21일(금) 밀레니엄 힐튼 그랜드볼룸\n* 주최: 매경미디어그룹(매경닷컴 | 매경비즈)\n* 후원: 고용노동부, 여성가족부, 동반성장위원회, 국회 기획재정위원회, 국회 문화체육관광위원회, 국회 농림축산식품해양수산위원회, 국회 산업통상자원중소벤처기업위원회\n\n<수상 내역>\n* 고객 만족경영 패밀리 리조트 브랜드 부문: 한국경제를 빛낸 인물 & 경영 - 매경 미디어그룹\n* 관광산업발전 유공(풀빌라&리조트 부문): 국회 문화체육관광위원회 위원장', true, NULL, '수상', 794, false),
	('f7e9ad3f-d5a7-40d0-9c26-11fbc1daca78', '2026-03-13 00:46:23.78393+00', '2026-03-13 00:49:58.641+00', '"해변의 쓰레기, 예술로 부활 아티스트 노엘라의 연금술"', '바이올린 연주자, 영화인, 칼럼니스트 등으로 종횡무진 활동 중인 ''융합 아티스트'' 노엘라(SE클럽 비전앤필라소피 총괄이사)가 미국 할리우드에서 영화 촬영을 마친 후 귀국해서 첫 공식 행보로 태안 해변을 찾았다.\n\n10일 노엘라 측에 따르면, 노엘라는 미국 베니스 비치에서 장편 영화 ''알케미알케미 인 베니스''(Alchemy in Venice) 촬영을 마치고 귀국한 바로 다음날인 지난달 28일 태안 꾸지나무골 해변에서 진행된 ''리버스 오브 더 씨(RE-BIRTH OF THE SEA): 쓰레기, 예술로 다시 피어나다'' 프로젝트 현장을 방문해 환경과 예술의 결합을 선보였다.\n\n이번 방문은 영화에서 다룬 ''연금술''이라는 주제를 현실의 환경 위기와 연결하려는 시도다. 버려진 쓰레기를 예술로 환생(Re-birth)시키는 과정을 통해 실천적 사유를 보여주기 위함이다.\n\n이날 프로젝트의 핵심은 ''업사이클링 플로깅''(Upcycling Plogging)이었다. ''낙원'' 자원봉사단 20여 명은 해변을 따라 걸으며 폐플라스틱과 그물 등 해양 쓰레기를 수거했고, 이를 활용해 새로운 가치를 창출하는 업사이클 프로젝트를 진행했다.\n\n노엘라 총괄이사는 이번 활동의 취지에 대해 "영화 ''알케미 인 베니스''가 예술을 통한 치유와 변화를 이야기하듯, SE클럽에서 이어지는 이 활동은 버려진 것들이 다시 태어나는 물리적 연금술의 확장"이라고 설명했다. 이어 "바다를 정화하고 쓰레기를 예술로 승화시키는 과정을 통해 인간과 자연이 함께 휴식하고 재생되는 경험을 하게 될 것"이라고 덧붙였다.\n\nSE클럽은 이번 활동을 시작으로 투숙객들이 직접 참여하는 프로그램을 본격화한다. 리조트 내에서 투숙객이 쓰레기를 수거하고 이를 이용해 직접 작품을 만들어보는 ''업사이클링 에코 아트 체험 프로그램''을 운영할 예정이다. 이는 단순한 숙박을 넘어 환경적 사유를 몸소 체험하는 기회를 제공한다.\n\n''사유하는 에코 아트 리조트''를 표방하는 SE클럽은 앞으로도 노엘라의 예술적 비전을 바탕으로 독창적인 행보를 이어갈 계획이다. 환경 보호가 의무를 넘어 하나의 삶의 예술이 되는 ''그린 스테이''(Green Stay) 문화를 확산시키겠다는 포부다.\n\n출처 ㅣ뉴스1 (https://www.news1.kr/life-culture/general-cultural/6096973)', true, '{https://nqsogxcasyjauqgwmrxi.supabase.co/storage/v1/object/public/notice/f7e9ad3f-d5a7-40d0-9c26-11fbc1daca78/2d018ed9-86bc-456f-92c3-73768fc67c18.jpg}', '공지', 61, false),
	('67aee20e-8243-4d90-b816-bef81d534915', '2026-04-06 07:37:17.086038+00', '2026-04-06 08:05:20.687+00', '[단체대관] 기업 전용 워크숍 및 직무 역량 강화 단체 대관 안내', '"창의적인 공간이 혁신적인 성과를 만듭니다"\nSE 클럽은 귀사의 성공적인 비즈니스 워크숍을 위한 가장 창의적인 무대가 될 것입니다.\n\n안녕하세요, 예술적 영감과 전략적 기획이 만나는 곳, SE 클럽입니다.\n우리 리조트는 기업의 지속 가능한 성장과 임직원의 창의적 직무 몰입을 돕기 위해 전용 워크숍 시설 및 기업 맞춤형 연수 프로그램을 운영하고 있습니다.\n\n단순한 모임을 넘어, 조직의 비전을 공유하고 성과를 도출하는 최적의 비즈니스 파트너가 되어 드립니다.\n\n1. 기업 고객을 위한 전략적 제안\n\n[창의적 조직력 강화(Team Building)] 하드비치(Hard Beach)의 광활한 해변 공간을 활용한 이색적인 아웃도어 활동\n\n[예술과 함께하는 비전 워크숍] 조각공원과 갤러리형 숙소에서 얻는 인문학적 영감과 창의적 아이디어 발굴\n\n[부서별 전략 워크숍] 집중도 높은 세미나실과 야외 공간을 활용한 아이디어 발굴 및 비전 공유\n\n[ESG 경영 실천 프로그램] 업사이클링 아트 체험 및 생태 정화 활동을 통한 기업의 사회적 책임 실현\n\n\n2. 시설 안내\n\n[다목적 비즈니스 센터] 프리젠테이션, 분과 토의, 전문 교육이 가능한 전용 강당\n\n[업사이클링 아트 스튜디오]버려진 자원을 예술로 재탄생시키며 창의력을 극대화하는 전용 체험 공간\n\n[하드비치_Hard Beach]리조트와 연결된 단단한 모래사장에서 즐기는 대규모 야외 행사 및 팀빌딩 활동\n\n[프라이빗 스테이] 업무 집중도를 높이고 최상의 컨디션을 유지할 수 있는 독립형 숙박 시설\n\n\n3. 직무 역량 강화 특화 프로그램\n\n[Innovation] 업사이클링 팀빌딩: 폐자재를 활용한 공동 작품 제작을 통한 협업 능력 강화\n\n[ESG Practice] 생태 가치 체험: 비치코밍 및 해안 생태 투어를 통한 기업의 환경 가치 내재화\n\n[Activity] 하드비치 & 독살 체험: 전통 어로 방식인 ''독살'' 체험과 광활한 해변 활동을 통한 협동과 몰입의 경험\n\n[Wellness] Beach Yoga & Meditation: 바닷가에서 즐기는 요가, 명상, 싱잉볼 프로그램을 통한 임직원 마인드케어\n\n[Special] 선셋 풀파티 & 케이터링: 음악과 조명, 야외 BBQ가 어우러진 서해 노을빛 아래의 고품격 소셜 네트워킹\n\n[Lectures] 노엘라의 렉처 콘서트: 예술적 감성을 통해 조직의 창의성과 리더십, 동기부여를 깨우는 프리미엄 강연 (*별도비용문의) \n\n\n4. 대관 신청 및 법인 상담 안내\n법인 고객을 위한 맞춤형 견적 및 제안서를 제공해 드립니다.\n\n법인 전용 문의: \n유종현 대표\n010 - 9703 - 1711\ntaean2015@naver.com\n\n', true, '{https://nqsogxcasyjauqgwmrxi.supabase.co/storage/v1/object/public/notice/67aee20e-8243-4d90-b816-bef81d534915/608dd950-1f07-4b72-b8e5-95aea1486b0c.jpg}', '공지', 829, false),
	('1b8d3d56-4f60-4cde-9ee3-c65e86db5751', '2026-04-06 08:44:30.746812+00', '2026-05-20 07:54:58.194+00', '대학 MT · 동호회 · 동창회 가족모임 등 단체 대관 및 특별 패키지 안내', '[대학 MT · 동호회 · 동창회 가족모임 등 단체 대관 및 특별 패키지 안내]

"선택된 소수만을 위한 프라이빗 해변에서 누리는 품격 있는 재회"
"탁 트인 하드비치에서 팀의 열정을 다시 깨울 단 하나의 공간"

SE CLUB의 넓은 대지와 전용 해변을 온전히 즐길 수 있는 [단체 전용 대관 서비스]를 안내해 드립니다.

"남들과 똑같은 장소가 아닌, 서해의 노을과 예술적 감성이 가득한 이곳에서 잊지 못할 추억을 만들어 보세요."

1. 단체별 맞춤 추천 포인트

* 동호회 (사진·미술·레저): 3만 3천 평의 대지와 조각공원, 객실 내 원화를 배경으로 하는 출사 및 정기 모임 
* 대학 MT 및 학생회: 하드비치에서의 비치 발리볼, 풋살 등 다이내믹한 팀 스포츠와 선셋 풀파티 
* 동창회 및 가족 모임: 솔향기 트래킹과 갯벌 체험, 밤하늘의 별을 보며 즐기는 캠프파이어와 BBQ

2. 주요 시설 및 이용 안내
우리 클럽은 외부인 출입이 제한된 전용 해변을 보유하여 프라이빗한 행사가 가능합니다. 

*다양한 숙박 옵션:  28개의 빌라와 118개의 캠핑 사이트를 보유하여 단체의 규모와 취향에 맞는 선택이 가능합니다. 특히 모든 객실에는 작가의 원화가 전시되어 있어, 머무는 것만으로도 예술적 영감을 선사하는 갤러리형 숙박을 제공합니다.

*단체 전용 공간: 세미나와 레크리에이션이 가능한 전용 강당 시설을 갖추고 있습니다 . 또한 가로 200m, 세로 1km에 달하는 광활한 하드비치는 비치 발리볼, 풋살 등 역동적인 팀 빌딩 활동에 최적화되어 있습니다.

*다채로운 즐길 거리: 서해의 아름다운 노을과 감성적인 라이트업이 어우러진 인피니티 풀(자체 해수풀)에서 특별한 시간을 보내실 수 있습니다. 야외 BBQ 시설과 프라이빗 디너 케이터링 서비스를 통해 단체만의 화합을 다질 수 있습니다. 

3. SE 클럽만의 이색 프로그램 (*별도비용문의) 
단순한 숙박을 넘어 단체의 결속력을 높여주는 특별한 체험을 더해보세요.

* [체험] 서해 갯벌 팀빌딩 및 전통 어로 방식인 ''독살 체험'' 
* [트레킹] 숲 해설사가 동반하는 솔향기 트래킹 
* [요가] 바닷가 요가·명상 세션
* [파티] 서해 노을 아래 즐기는 선셋 풀파티와 와인 테이블 케이터링 

 4. 예약 및 단체 혜택 문의
단체 규모와 일정에 따라 최적의 패키지를 제안해 드립니다.


지금 SE 클럽에서 우리 팀만의 독창적인 이야기를 시작해 보세요!

* 상담 문의: 010-9703-1711
* 이메일: taean2015@naver.com ', true, NULL, '공지', 58, false);


--
-- Data for Name: popups; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."popups" ("id", "title", "content", "image_url", "link_url", "active", "priority", "start_date", "end_date", "created_at", "updated_at") VALUES
	('eb7b9818-1ba8-490c-90ef-dcbee56eb744', '웰니스 프로그램 안내', NULL, 'https://nqsogxcasyjauqgwmrxi.supabase.co/storage/v1/object/public/popups/eb7b9818-1ba8-490c-90ef-dcbee56eb744/990b2378-b11c-4c32-a74f-8cf1ddf75343.png', 'https://cafe.naver.com/f-e/cafes/25968629/articles/16897?boardtype=L&menuid=296&referrerAllArticles=false', true, 0, '2026-04-28 00:00:00+00', '2026-05-09 00:00:00+00', '2026-04-28 13:51:48.723235+00', '2026-05-04 09:39:46.778+00');


--
-- Data for Name: profile; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: room_infos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."room_infos" ("id", "slug", "data", "is_active", "created_at", "updated_at") VALUES
	('7034d474-14a5-49a6-bb7b-2ddad3f069a2', 'ocean-condo', '{"name": "오션 콘도 스탠다드", "title": "오션 콘도 스탠다드", "features": [{"icon": "DoorClosed", "label": "방 구성", "value": "방 · 욕실 · 주방 · 테라스"}, {"icon": "BedDouble", "label": "침대 개수", "value": "1개"}, {"icon": "Users", "label": "인원", "value": "2인 (최대 4인)"}, {"icon": "Clock", "label": "체크인/아웃", "value": "15:00 / 11:00"}], "overview": "SE CLUB 오션콘도는 탁 트인 바다 전망과 황홀한 노을을 객실에서 감상할 수 있는 콘도입니다. **실내 주방**과 **야외 인덕션** 테이블이 마련되어 있어 바다와 산, 별빛을 배경으로 낭만적인 요리를 즐길 수 있습니다.", "subtitle": "콘도형", "amenities": [{"img": "/images/room/ocean-condo/kitchen.jpg", "title": "주방", "description": "개별 주방 (냉장고, 전자레인지, 전기밥솥, 커피포트 등)"}, {"img": "/images/room/ocean-condo/grill.jpg", "title": "바비큐 그릴", "description": "개별 바비큐 그릴 (확장형, 기본형 나동 12호)"}, {"img": "/images/room/ocean-condo/induction.jpg", "title": "야외 인덕션", "description": "주방 별도 야외 베란다 인덕션과 테이블 설치"}], "heroImage": "/images/room/ocean-condo/hero.jpg", "mainImages": ["/images/room/ocean-condo/main-1.jpg", "/images/room/ocean-condo/main-2.jpg", "/images/room/ocean-condo/main-3.jpg", "/images/room/ocean-condo/main-4.jpg", "/images/room/ocean-condo/main-5.jpg", "/images/room/ocean-condo/main-6.jpg", "/images/room/ocean-condo/main-7.png"], "additionalInfo": [{"items": ["- 기준인원(2인)을 초과하여 투숙 시 초과 1인당 1박에 20,000원 추가 요금이 부과되며 초과 된 인원의 침구류 등은 사전에 세팅됩니다.", "- 반려견은 1마리당 1박에 10,000원이 부과되며, 최대 2마리까지 입실 가능합니다. (맹견·중대형견은 출입이 제한됩니다.)", "- 주차는 동별 1대는 무료이며, 초과 1대부터 1박당 10,000원이 부과됩니다. (초과차량은 공용주차장에 주차)"], "title": "추가 요금 안내"}, {"items": ["- 얼리 체크인: 오후 2시 이전 체크인 시 20,000원 추가", "- 레이트 체크아웃: 3시간 연장 시 35,000원, 6시간 연장 시 45,000원", "- 기본 체크인 오후 3시, 체크아웃 오전 11시입니다."], "title": "체크인·체크아웃 안내"}, {"items": ["- 드실 것과 양념은 제공되지 않으니 개인 준비를 부탁드립니다.", "- 정부의 일회용품 사용 자제 시책에 따라 치약·칫솔 등 욕실용품은 제공되지 않으니 개인 준비를 부탁드립니다.", "- 건강한 생태계에서는 풍뎅이, 나방, 돈 벌래 등 여러 가지 곤충들이 서식하고 있습니다. 절대로 창문이나 출입문을 열어두시면 안됩니다."], "title": "시설 이용 안내"}]}', true, '2026-03-20 05:05:41.296017+00', '2026-03-20 05:05:41.296017+00'),
	('f16ea142-ecfe-4f1e-a4f0-4ad89abdfa0d', 'camping-house', '{"name": "선셋 캠핑하우스", "title": "선셋 캠핑하우스", "features": [{"icon": "DoorClosed", "label": "방 구성", "value": "방 2 · 욕실 · 주방 · 테라스"}, {"icon": "BedDouble", "label": "침대 개수", "value": "2개"}, {"icon": "Users", "label": "인원", "value": "4인 (최대 6인)"}, {"icon": "Dog", "label": "반려견 동반", "value": "최대 2마리"}, {"icon": "Clock", "label": "체크인/아웃", "value": "15:00 / 11:00"}], "overview": "SE CLUB 선셋 캠핑 하우스는 2층 복층형 단독주택과 **캠핑 사이트**가 어우러진 공간으로, **실내의 편안함**과 **캠핑의 즐거움**을 함께 누릴 수 있습니다. 야외 데크에서는 바다와 산, 별빛을 배경으로 **바비큐**를 즐기며 낭만적인 시간을 보낼 수 있습니다.", "subtitle": "캠핑", "amenities": [{"img": "/images/room/camping-house/kitchen.jpg", "title": "주방", "description": "개별 주방 (냉장고, 전자레인지, 전기밥솥, 커피포트 등)"}, {"img": "/images/room/camping-house/grill.jpg", "title": "바비큐 그릴", "description": "개별 바비큐 그릴 (숯·번개탄·장갑 등 무료 제공)"}], "heroImage": "/images/room/camping-house/hero.jpg", "mainImages": ["/images/room/camping-house/main-1.jpg", "/images/room/camping-house/main-2.jpg", "/images/room/camping-house/main-3.jpg", "/images/room/camping-house/main-4.jpg", "/images/room/camping-house/main-5.jpg"], "additionalInfo": [{"items": ["- 기준인원(4인)을 초과하여 투숙 시 초과 1인당 1박에 20,000원 추가 요금이 부과되며 초과 된 인원의 침구류 등은 사전에 세팅됩니다.", "- 반려견은 1마리당 1박에 10,000원이 부과되며, 최대 2마리까지 입실 가능합니다. (맹견·중대형견은 출입이 제한됩니다.)", "- 1개 시설마다 차량 1대의 주차장이 준비되어 있으며, 초과차량 1대당 10,000원/(1박)이 부과됩니다. (초과차량은 공용주차장에 주차)"], "title": "추가 요금 안내"}, {"items": ["- 얼리 체크인: 오후 2시 이전 체크인 시 20,000원 추가", "- 레이트 체크아웃: 3시간 연장 시 50,000원, 6시간 연장 시 65,000원", "- 기본 체크인 오후 3시, 체크아웃 오전 11시입니다."], "title": "체크인·체크아웃 안내"}, {"items": ["- 드실 것과 양념은 제공되지 않으니 개인 준비를 부탁드립니다.", "- 정부의 일회용품 사용 자제 시책에 따라 치약·칫솔 등 욕실용품은 제공되지 않으니 개인 준비를 부탁드립니다.", "- 건강한 생태계에서는 풍뎅이, 나방, 돈 벌래 등 여러 가지 곤충들이 서식하고 있습니다. 절대로 창문이나 출입문을 열어두시면 안됩니다."], "title": "시설 이용 안내"}]}', true, '2026-03-20 05:05:41.296017+00', '2026-03-20 05:05:41.296017+00'),
	('76e66e58-4569-4e4a-9854-6ade5f76eced', 'spa-villa', '{"name": "오션스파빌라", "title": "오션스파빌라", "features": [{"icon": "DoorClosed", "label": "방 구성", "value": "방 2 · 욕실 · 주방 · 테라스"}, {"icon": "BedDouble", "label": "침대 개수", "value": "2개"}, {"icon": "Users", "label": "인원", "value": "4인 (최대 6인)"}, {"icon": "Dog", "label": "반려견 동반 가능", "value": "최대 2마리"}, {"icon": "Clock", "label": "체크인/아웃", "value": "15:00 / 11:00"}], "overview": "SE CLUB 오션 스파빌라는 다락방이 있는 2층 복층형 단독주택으로, **넓은 테라스**와 프라이빗 야외 **자쿠지 스파**가 마련된 힐링 공간입니다. 바다와 산, 별빛을 배경으로 온전한 휴식을 즐길 수 있으며, **개별 바비큐 화덕**과 **완비된 주방**, 세면도구까지 갖추어 편안함과 낭만을 모두 누릴 수 있습니다.", "subtitle": "자쿠지", "amenities": [{"img": "/images/room/spa-villa/kitchen.jpeg", "title": "주방", "description": "개별 주방 (냉장고, 전자레인지, 전기밥솥, 커피포트 등)"}, {"img": "/images/room/spa-villa/grill.jpeg", "title": "바비큐 그릴", "description": "개별 바비큐 그릴 (숯·번개탄·장갑 등 무료 제공)"}, {"img": "/images/room/spa-villa/jacuzzi.jpeg", "title": "자쿠지", "description": "개별 자쿠지 (계절 관계없이 사용 가능)"}], "heroImage": "/images/room/spa-villa/hero.jpg", "mainImages": ["/images/room/spa-villa/main-1.jpg", "/images/room/spa-villa/main-2.jpg", "/images/room/spa-villa/main-3.jpg", "/images/room/spa-villa/main-4.jpg", "/images/room/spa-villa/main-5.jpg", "/images/room/spa-villa/main-6.jpg"], "additionalInfo": [{"items": ["- 기준인원(4인)에서 추가되는 인원의 1인당 요금은 20,000원이며, 예약하신 추가된 인원의 침구, 세면도구, 식기류 등은 사전에 세팅됩니다.", "- 반려견은 1마리당 1박에 10,000원이 부과되며, 최대 2마리까지 입실 가능합니다. (맹견·중대형견은 출입이 제한됩니다.)", "- 주차는 동별 1대는 무료이며, 초과 1대부터 1박당 10,000원이 부과됩니다. (초과차량은 공용주차장에 주차)"], "title": "추가 요금 안내"}, {"items": ["- 얼리 체크인: 오후 2시 이전 체크인 시 20,000원 추가", "- 레이트 체크아웃: 3시간 연장 시 60,000원, 6시간 연장 시 75,000원", "- 기본 체크인 오후 3시, 체크아웃 오전 11시입니다."], "title": "체크인·체크아웃 안내"}, {"items": ["- 드실 것과 양념은 제공되지 않으니 개인 준비를 부탁드립니다.", "- 정부의 일회용품 사용 자제 시책에 따라 치약·칫솔 등 욕실용품은 제공되지 않으니 개인 준비를 부탁드립니다.", "- 스파 설비 고장 위험으로 인해 입욕제 사용은 불가합니다.", "- 건강한 생태계에서는 풍뎅이, 나방, 돈 벌래 등 여러 가지 곤충들이 서식하고 있습니다. 절대로 창문이나 출입문을 열어두시면 안됩니다."], "title": "시설 이용 안내"}]}', true, '2026-03-20 05:05:41.296017+00', '2026-03-20 05:05:41.296017+00'),
	('73305e8b-04c7-477b-af93-f18cd3a7b098', 'premium-villa', '{"name": "프리미엄 빌라", "title": "프리미엄 빌라", "features": [{"icon": "DoorClosed", "label": "방 구성", "value": "방 3 · 욕실 2 · 주방 · 테라스 · 풀"}, {"icon": "BedDouble", "label": "침대 개수", "value": "3개"}, {"icon": "Users", "label": "인원", "value": "6인"}, {"icon": "Dog", "label": "반려견 동반 가능", "value": "최대 2마리"}, {"icon": "Clock", "label": "체크인/아웃", "value": "15:00 / 11:00"}], "overview": "SE CLUB 프리미엄 빌라는 끝없이 펼쳐진 바다와 황홀한 노을이 객실 창문 너머로 펼쳐지는 특별한 휴식처입니다. **실내 주방**, **야외 인피니티 풀**, **프라이빗 바비큐 공간**을 갖춰, 바다, 산, 그리고 별빛이 수놓인 낭만의 순간을 한층 더 완벽하게 즐기실 수 있습니다.", "subtitle": "인피니티 풀", "amenities": [{"img": "/images/room/premium-villa/pool.JPG", "title": "인피니티 풀", "description": "선배드와 의자가 어우러진 12미터 전용 인피니티 풀"}, {"img": "/images/room/premium-villa/kitchen.jpg", "title": "주방", "description": "개별 주방 (냉장고, 전자레인지, 전기밥솥, 커피포트 등)"}, {"img": "/images/room/premium-villa/grill.jpeg", "title": "바비큐 그릴", "description": "개별 바비큐 그릴"}, {"img": "/images/room/premium-villa/jacuzzi.jpg", "title": "자쿠지", "description": "개별 자쿠지"}], "heroImage": "/images/room/premium-villa/hero.jpg", "mainImages": ["/images/room/premium-villa/main-1.jpeg", "/images/room/premium-villa/main-2.jpeg", "/images/room/premium-villa/main-3.jpg", "/images/room/premium-villa/main-4.jpeg", "/images/room/premium-villa/main-5.jpg", "/images/room/premium-villa/main-6.jpg", "/images/room/premium-villa/main-7.jpg"], "additionalInfo": [{"items": ["- 수영장의 크기는 가로 2.6m, 세로 12m, 깊이 1.2m이며 바닷물을 사용합니다.", "- 어린이는 반드시 구명조끼 등 안전 장비를 착용하고 보호자와 함께 이용해야 하며, 다이빙·점프·뜀박질 등 위험 행위는 금지됩니다."], "title": "수영장 안내"}, {"items": ["- 주차는 2대 무료 제공되며, 추가 1대부터 1박당 20,000원이 청구됩니다."], "title": "추가 요금 안내"}, {"items": ["- 얼리 체크인: 오후 2시 이전 체크인 시 50,000원 추가", "- 레이트 체크아웃: 3시간 연장 시 150,000원, 6시간 연장 시 300,000원", "- 기본 체크인 오후 3시, 체크아웃 오전 11시입니다."], "title": "체크인·체크아웃 안내"}, {"items": ["- 드실 것과 양념은 제공되지 않으니 개인 준비를 부탁드립니다.", "- 정부의 일회용품 사용 자제 시책에 따라 치약·칫솔 등 욕실용품은 제공되지 않으니 개인 준비를 부탁드립니다.", "- 건강한 생태계에서는 풍뎅이, 나방, 돈 벌래 등 여러 가지 곤충들이 서식하고 있습니다. 절대로 창문이나 출입문을 열어두시면 안됩니다."], "title": "시설 이용 안내"}]}', true, '2026-03-20 05:05:41.296017+00', '2026-03-20 05:05:41.296017+00'),
	('56e60fc9-4a78-46bf-8525-4e431821a7b5', 'pool-villa', '{"name": "해수 풀빌라", "title": "해수 풀빌라", "features": [{"icon": "DoorClosed", "label": "방 구성", "value": "방 2 · 욕실 · 주방 · 테라스"}, {"icon": "BedDouble", "label": "침대 개수", "value": "2개"}, {"icon": "Users", "label": "인원", "value": "4인 (최대 6인)"}, {"icon": "Dog", "label": "반려견 동반 가능", "value": "최대 2마리"}, {"icon": "Clock", "label": "체크인/아웃", "value": "15:00 / 11:00"}], "overview": "피부 진정과 스트레스 완화에 효과적인 **해수**를 사용하는 SE CLUB 해수풀빌라는, 각 독채마다 **프라이빗 가든**과 전용 **풀·스파**가 완비된 유니크한 힐링 공간입니다. 외부의 방해 없이 오롯이 나만의 시간을 즐기며 깊은 휴식을 경험할 수 있습니다", "subtitle": "1-7 독채", "amenities": [{"img": "/images/room/pool-villa/kitchen.jpg", "title": "주방", "description": "개별 주방 (냉장고, 전자레인지, 전기밥솥, 커피포트 등)"}, {"img": "/images/room/pool-villa/pool.jpg", "title": "해수 풀", "description": "바닷물을 이용한 풀 (규격 4.5 * 2.5 * 0.9m)"}, {"img": "/images/room/pool-villa/grill.jpg", "title": "바비큐 그릴", "description": "개별 바비큐 그릴 (숯·번개탄·장갑 등 무료 제공)"}, {"img": "/images/room/pool-villa/spa.jpg", "title": "월풀 스파", "description": "월풀 스파 (입욕제 사용 불가, 2회 사용 후 4시간 대기)"}], "heroImage": "/images/room/pool-villa/hero.jpg", "mainImages": ["/images/room/pool-villa/main-1.jpg", "/images/room/pool-villa/main-2.jpg", "/images/room/pool-villa/main-3.jpg", "/images/room/pool-villa/main-4.jpg"], "additionalInfo": [{"items": ["- 수영장의 크기는 가로 4.5m, 세로 2.5m, 깊이 0.9m이며 바닷물을 사용합니다.", "- 이용 기간은 7~8월이며 확정 일정은 별도 공지를 통해 안내됩니다.", "- 수위는 0.75m 이하로 유지되며, 체크인 시 물을 교체합니다.", "- 바닷물을 이용 함으로 피부에 좋은 머드 등이 섞일 수 있으며 태풍 등 천재지변 시 이용이 어려울 수 있습니다.", "- 어린이는 반드시 구명조끼 등 안전 장비를 착용하고 보호자와 함께 이용해야 하며, 다이빙·점프·뜀박질 등 위험 행위는 금지됩니다."], "title": "수영장 안내"}, {"items": ["- 기준 인원(4인)을 초과하여 투숙 시 초과 1인당 1박에 20,000원 추가 요금이 부과되며 초과 된 인원의 침구류 등은 사전에 세팅됩니다.", "- 반려견은 1마리당 1박에 10,000원이 부과되며, 최대 2마리까지 입실 가능합니다. (맹견·중대형견은 출입이 제한됩니다.)", "- 주차는 동별 1대는 무료이며, 초과 1대부터 1박당 10,000원이 부과됩니다. (초과차량은 공용주차장에 주차)"], "title": "추가 요금 안내"}, {"items": ["- 얼리 체크인: 오후 2시 이전 체크인 시 20,000원 추가", "- 레이트 체크아웃: 3시간 연장 시 55,000원, 6시간 연장 시 70,000원", "- 기본 체크인 오후 3시, 체크아웃 오전 11시입니다."], "title": "체크인·체크아웃 안내"}, {"items": ["- 드실 것과 양념은 제공되지 않으니 개인 준비를 부탁드립니다.", "- 정부의 일회용품 사용 자제 시책에 따라 치약·칫솔 등 욕실용품은 제공되지 않으니 개인 준비를 부탁드립니다.", "- 스파 설비 고장 위험으로 인해 입욕제 사용은 불가합니다.", "- 전기 온수 탱크 특성상, 1회 사용 후에는 최소 4시간이 경과 후에 재사용이 가능합니다. (온수를 틀기 전에 꼭 스파 배수구를 막아 주세요.)", "- 건강한 생태계에서는 풍뎅이, 나방, 돈 벌래 등 여러 가지 곤충들이 서식하고 있습니다. 절대로 창문이나 출입문을 열어두시면 안됩니다."], "title": "시설 이용 안내"}]}', true, '2026-03-20 05:05:41.296017+00', '2026-03-25 15:20:28.7839+00'),
	('1256b94f-2b9d-4bf2-a602-984a6ff376ba', 'ocean-condo-extended', '{"name": "오션 콘도 디럭스", "title": "오션 콘도 디럭스", "features": [{"icon": "DoorClosed", "label": "방 구성", "value": "방 · 욕실 · 주방 · 테라스"}, {"icon": "BedDouble", "label": "침대 개수", "value": "2개"}, {"icon": "Users", "label": "인원", "value": "4인 (최대 6인)"}, {"icon": "Clock", "label": "체크인/아웃", "value": "15:00 / 11:00"}], "overview": "SE CLUB 오션콘도는 탁 트인 바다 전망과 황홀한 노을을 객실에서 감상할 수 있는 콘도입니다. **실내 주방**과 **야외 인덕션** 테이블, **숯불 화덕 바베큐**가 마련되어 있어 바다와 산, 별빛을 배경으로 낭만적인 요리를 즐길 수 있습니다.", "subtitle": "콘도형", "amenities": [{"img": "/images/room/ocean-condo-extended/kitchen.jpg", "title": "주방", "description": "개별 주방 (냉장고, 전자레인지, 전기밥솥, 커피포트 등)"}, {"img": "/images/room/ocean-condo-extended/grill.jpg", "title": "바비큐 그릴", "description": "개별 바비큐 그릴 (확장형, 기본형 나동 12호)"}, {"img": "/images/room/ocean-condo-extended/induction.jpg", "title": "야외 인덕션", "description": "주방 별도 야외 베란다 인덕션과 테이블 설치"}], "heroImage": "/images/room/ocean-condo-extended/hero.jpg", "mainImages": ["/images/room/ocean-condo-extended/main-1.jpg", "/images/room/ocean-condo-extended/main-2.jpg", "/images/room/ocean-condo-extended/main-3.jpg", "/images/room/ocean-condo-extended/main-4.png"], "additionalInfo": [{"items": ["- 기준인원(4인)을 초과하여 투숙 시 초과 1인당 1박에 20,000원 추가 요금이 부과되며 초과 된 인원의 침구류 등은 사전에 세팅됩니다.", "- 반려견은 1마리당 1박에 10,000원이 부과되며, 최대 2마리까지 입실 가능합니다. (맹견·중대형견은 출입이 제한됩니다.)", "- 주차는 동별 1대는 무료이며, 초과 1대부터 1박당 10,000원이 부과됩니다. (초과차량은 공용주차장에 주차)"], "title": "추가 요금 안내"}, {"items": ["- 얼리 체크인: 오후 2시 이전 체크인 시 20,000원 추가", "- 레이트 체크아웃: 3시간 연장 시 45,000원, 6시간 연장 시 60,000원", "- 기본 체크인 오후 3시, 체크아웃 오전 11시입니다."], "title": "체크인·체크아웃 안내"}, {"items": ["- 드실 것과 양념은 제공되지 않으니 개인 준비를 부탁드립니다.", "- 정부의 일회용품 사용 자제 시책에 따라 치약·칫솔 등 욕실용품은 제공되지 않으니 개인 준비를 부탁드립니다.", "- 건강한 생태계에서는 풍뎅이, 나방, 돈 벌래 등 여러 가지 곤충들이 서식하고 있습니다. 절대로 창문이나 출입문을 열어두시면 안됩니다."], "title": "시설 이용 안내"}]}', true, '2026-03-20 05:05:41.296017+00', '2026-04-26 22:55:27.218227+00');


--
-- Data for Name: videos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."videos" ("id", "created_at", "link", "title", "order") VALUES
	('dd258a67-a1de-4f6b-9266-60df2893b8cf', '2025-08-03 15:15:03.675275+00', 'WOu5D2-fm40', '해수 풀빌라', 1),
	('c300653e-60e2-4528-80c6-e85dc50eeef8', '2025-08-03 15:15:03.675275+00', 'huu-2bpHJjI', '오션 스파빌라', 2),
	('3dd8437a-54dd-4e13-8844-ef7ca2bc2404', '2025-08-03 15:15:03.675275+00', 'DH3ghWQOLt0', '오션콘도 Standard', 3),
	('ba439907-333c-4634-9ba2-9dbf59413be3', '2025-08-03 15:15:03.675275+00', '8gsztJhouEs', '오션콘도 Deluxe', 4),
	('9c58e8cf-9957-4541-9e0e-0ee1519a0062', '2025-09-05 07:13:44.389071+00', 'DzfRsAUb_GM', '캠핑장 | S 사이트', 5),
	('8f90304f-8d54-4def-9941-215d67a1c096', '2025-08-03 15:15:03.675275+00', 'U5SRkqtV04U', '자연체험 프로그램', 7),
	('a15e0874-9ae6-4c20-b74c-083503930139', '2025-08-03 15:15:03.675275+00', 'GWQziHmK9A4', '조각공원', 6);


--
-- Data for Name: wellness_programs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."wellness_programs" ("slug", "header", "contents", "images", "updated_at") VALUES
	('nature-experience', '{"type": "생태 체험·갯바위 낚시", "hours": "프로그램별 상이 (사전 문의)", "image": "/images/wellness/nature-experience/hero.jpg", "title": "자연 체험 프로그램", "location": "앞바다 및 갯바위 전역", "subtitle": "바다 속 산책부터 갯벌 생태·독살 체험, 갯바위 낚시까지 다양한 해양 액티비티를 제공합니다."}', '["바다 속 산책: 간조 시 신발 신고 최대 500m 진입, 갯바위·조개 지대 탐험", "생태 체험: 굴·고동·개불·명주조개 관찰 및 소량 채집 (자연 보호 준수)", "독살 체험: 전통 어로법 이해 및 체험, 안전 교육 후 진행", "갯바위 낚시: 낚싯대·미끼 준비", "안내: 체험 후에는 캠핑장 내 야외 개수대를 자유롭게 이용 가능", "유의 사항: 매일 물때표 확인 필수, 구명조끼·장갑 권장, 갯바위 미끄럼 주의"]', '["/images/wellness/nature-experience/1.jpg", "/images/wellness/nature-experience/2.jpg", "/images/wellness/nature-experience/3.jpg", "/images/wellness/nature-experience/4.jpg", "/images/wellness/nature-experience/5.jpg", "/images/wellness/nature-experience/6.jpg"]', '2026-04-26 21:10:18.828391+00'),
	('special-activity', '{"type": "유명 작품 감상", "hours": "09:00 – 18:00", "image": "/images/wellness/special-activity/hero.jpg", "title": "조각공원", "location": "단지 입구", "subtitle": "국내 정상급 조각가들의 작품을 숲·잔디밭·전망데크에서 만나는 야외 미술관입니다."}', '["주요 작가·작품: 김영중(유기적 곡선), 김석우(금속·돌 대비), 이필언(자연물 기반 대형 아트)", "관람 동선: 입구 광장 → 숲속 미로 → 전망데크 → 잔디밭 전시장"]', '["/images/wellness/special-activity/1.jpg", "/images/wellness/special-activity/2.jpg", "/images/wellness/special-activity/3.jpg", "/images/wellness/special-activity/4.jpg"]', '2026-04-26 21:10:18.828391+00'),
	('swimming-pool', '{"type": "수영장", "hours": "10:00 – 19:00", "image": "/images/wellness/swimming-pool/hero.jpg", "title": "공용 인피니티 수영장", "location": "오션스파빌라 & 오션 콘도 & 선셋 캠핑하우스 인근", "subtitle": "오션콘도와 오션스파빌라, 선셋 캠핑하우스 인근에 위치한 바다 전경의 프라이빗 야외 풀장과 족욕탕을 즐길 수 있습니다."}', '["운영 기간: 매년 7월~8월 (상세 일정 별도 공지)", "이용 시간: 10:00 – 19:00", "풀장 사양: 가로 17m × 폭 11m, 어린이 0.6m / 성인 1.0m, 족욕탕(280×140×60cm)·사계절 온수", "수칙: 신발 벗고 이용, 음식물·반려동물 금지, 어린이는 보호자 동반·구명조끼 착용, 다이빙·점핑 금지"]', '["/images/wellness/swimming-pool/1.jpg", "/images/wellness/swimming-pool/2.jpg", "/images/wellness/swimming-pool/3.jpg", "/images/wellness/swimming-pool/4.jpg"]', '2026-04-26 21:10:18.828391+00'),
	('photo-spot', '{"type": "사진 명소", "hours": "상시 개방", "image": "/images/wellness/photo-spot/hero.jpg", "title": "포토스팟", "location": "단지 전역", "subtitle": "절경 포인트를 모아둔 단지 내 대표 ''인생샷'' 명소를 안내합니다."}', '["1전망대(반려견 캠핑장 위): 산·바다 파노라마 뷰", "2전망대: 해안 절벽 위 조망", "별장 2·3구역 풀장: 풀과 바다가 연결된 뷰", "조각공원: 대표 작품 앞 연출 샷", "농원 오솔길: 계절별 꽃·과실 배경", "제2·제3해변: 간조 전후 갯바위·모래사장 뷰", "나무화석: 제2해변 낚시터 근처 위치"]', '["/images/wellness/photo-spot/1.jpg", "/images/wellness/photo-spot/2.jpg", "/images/wellness/photo-spot/3.jpg"]', '2026-04-26 21:10:18.828391+00'),
	('walk', '{"type": "산책로", "hours": "상시 개방", "image": "/images/wellness/walk/hero.jpg", "title": "산책로", "location": "단지 전역", "subtitle": "울창한 솔향기 숲길과 간조 시 열리는 드넓은 해안길을 따라 걷는 10.2km 트레킹 코스입니다."}', '["SE Club 1코스 : 1해변 → 선셋 캠핑하우스", "SE Club 2코스 : 오션 콘도 → 관리사무소", "SE Club 3코스 : 반려견 캠핑장 → 인피니티 풀 (사계절 꽃과 과실 관찰 가능)", "안전 팁: 등산화 착용, 물·간식 지참, 물때표 확인, 해안 구간 미끄럼 주의"]', '["/images/wellness/walk/1.jpg", "/images/wellness/walk/2.jpg", "/images/wellness/walk/3.jpg", "/images/wellness/walk/4.jpg", "/images/wellness/walk/5.jpg", "/images/wellness/walk/6.jpg", "/images/wellness/walk/7.jpg", "/images/wellness/walk/8.jpg", "/images/wellness/walk/9.jpg"]', '2026-04-26 21:10:18.828391+00'),
	('camping-pool', '{"type": "수영장", "hours": "10:00 – 19:00", "image": "/images/wellness/camping-pool/hero.jpg", "title": "캠핑장 내 해수 풀장", "location": "캠핑장 B사이트 인근", "subtitle": "캠핑장 구역에 마련된 바닷물 풀장에서 자연 속 해수욕장 같은 물놀이를 즐겨보세요."}', '["운영 기간: 매년 7월~8월 (상세 일정 별도 공지)", "이용 시간: 10:00 – 19:00", "풀장 사양: 가로 12m × 폭 5m, 최대 깊이 0.9m (수위 0.75m 이하)", "바닷물 이용으로 머드 성분 함유 가능", "주의 사항: 태풍·폭우 시 이용 제한, 갯바위 미끄럼 주의", "이용 수칙: 신발 벗고 이용, 음식물·반려동물 금지, 어린이는 보호자 동반·안전 장비 착용 필수", "금연 구역, 쓰레기 분리수거장(쥬라기 포토존 앞) 이용"]', '["/images/wellness/camping-pool/1.jpg", "/images/wellness/camping-pool/2.jpg", "/images/wellness/camping-pool/3.jpg"]', '2026-04-26 21:10:18.828391+00'),
	('seminar-room', '{"type": "세미나실", "hours": "09:00 – 21:00 (예약제)", "image": "/images/wellness/seminar-room/hero.jpg", "title": "세미나실(전시장)", "location": "캠핑장 A사이트 인근", "subtitle": "소규모 강연·워크숍·공연이 가능한 다목적 공간으로, 무대·음향·조명 시설을 갖추고 있습니다."}', '["예약·문의: 사전 예약 필수, 010-9703-1711", "수용 인원: 최대 50명 (의자 배치 변경 가능)", "시설 사양: 무대(5m×3m), 프로젝터·스크린, 유·무선 마이크 2대, 스피커, 조명 레일, 간이 객석 30석", "비용: 기본 대관료·장비 사용료 별도 문의", "부대 서비스: 음향·영상 기술 스탭 파견 가능"]', '["/images/wellness/seminar-room/2.jpg", "/images/wellness/seminar-room/1.jpg"]', '2026-04-26 21:10:18.828391+00'),
	('store', '{"type": "원두 맛집", "hours": "09:00 – 21:00", "image": "/images/wellness/store/hero.jpg", "title": "매점 & 리필스테이션", "location": "관리동", "subtitle": "무포장·용기내 캠페인과 제로웨이스트 샵, 핸드드립 커피·비건 스낵을 만나는 편의 공간입니다."}', '["위치·운영: 관리동 입구 내, 09:00–21:00, 문의 010-3945-2079", "무포장 캠페인: 용기 지참 시 할인, 종이가방·용기 대여(보증금 500원)", "리필스테이션 품목: 주방세제·소프넛·올리브오일·발사믹·포도씨유·핑크솔트 입욕제·원두 소분", "제로웨이스트 샵: 대나무칫솔·고체치약·고체비누·썬크림·바디로션·업사이클링 소품", "커피 & 다과: 핸드드립 커피, 유기농 비건 스낵·초콜릿, 무료 정수물(용기 지참 필수), 소프트 아이스크림(비수기 주말)", "이벤트: 당일 밭 수확 상추 무료 제공 (매장 공지 확인)"]', '["/images/wellness/store/1.jpg", "/images/wellness/store/2.jpg", "/images/wellness/store/3.jpg"]', '2026-04-26 22:48:28.534252+00');


--
-- Name: discount_rates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."discount_rates_id_seq"', 18, true);


--
-- Name: late_checkout_rates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."late_checkout_rates_id_seq"', 6, true);


--
-- Name: room_rates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."room_rates_id_seq"', 8, true);


--
-- PostgreSQL database dump complete
--

RESET ALL;
