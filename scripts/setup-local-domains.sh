#!/usr/bin/env bash
#
# /etc/hosts 에 *.seclub.local 항목 추가
# 로컬에서 subdomain SSO (쿠키 공유) 테스트하기 위함
#
# 사용:   sudo ./scripts/setup-local-domains.sh
# 제거:   sudo ./scripts/setup-local-domains.sh remove

set -euo pipefail

HOSTS_FILE="/etc/hosts"
BEGIN_MARK="# >>> seclub local domains >>>"
END_MARK="# <<< seclub local domains <<<"

ENTRIES=$(cat <<'EOF'
127.0.0.1  seclub.local
127.0.0.1  auth.seclub.local
127.0.0.1  admin.seclub.local
127.0.0.1  my.seclub.local
127.0.0.1  reserve.seclub.local
EOF
)

if [[ "$EUID" -ne 0 ]]; then
  echo "error: /etc/hosts 수정에는 sudo 권한이 필요합니다." >&2
  echo "       sudo $0 ${1:-}" >&2
  exit 1
fi

remove_existing() {
  if grep -qF "$BEGIN_MARK" "$HOSTS_FILE"; then
    sed -i.seclub-bak "/$BEGIN_MARK/,/$END_MARK/d" "$HOSTS_FILE"
    echo "기존 seclub 항목 제거됨 (backup: ${HOSTS_FILE}.seclub-bak)"
  fi
}

case "${1:-add}" in
  remove|uninstall)
    remove_existing
    echo "완료: seclub 로컬 도메인이 /etc/hosts에서 제거되었습니다."
    ;;
  add|install|"")
    remove_existing
    {
      echo ""
      echo "$BEGIN_MARK"
      echo "$ENTRIES"
      echo "$END_MARK"
    } >> "$HOSTS_FILE"
    echo "완료: 다음 도메인이 127.0.0.1로 매핑됩니다."
    echo "$ENTRIES" | sed 's/^/  /'
    echo ""
    echo "접속 예:"
    echo "  http://seclub.local:3000          (landing)"
    echo "  http://admin.seclub.local:3001    (admin)"
    echo "  http://reserve.seclub.local:3002  (reserve)"
    echo "  http://my.seclub.local:3003       (mypage)"
    echo "  http://auth.seclub.local:3004     (auth — SSO 쿠키 발급)"
    ;;
  *)
    echo "사용법: sudo $0 [add|remove]" >&2
    exit 1
    ;;
esac
