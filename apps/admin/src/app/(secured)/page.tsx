import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookCheck, CalendarPlus, XCircle, BedDouble, Tent, ArrowUpRight, PlusCircle, ImageIcon } from "lucide-react"
import Link from "next/link"
import { BookingChart } from "@/components/charts"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function DashboardPage() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 예약</CardTitle>
            <BookCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,254건</div>
            <p className="text-xs text-muted-foreground">지난 달 대비 +10.2%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">오늘 신규 예약</CardTitle>
            <CalendarPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+32건</div>
            <p className="text-xs text-muted-foreground">어제 대비 +5.5%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">취소된 예약</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12건</div>
            <p className="text-xs text-muted-foreground">이번 주</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">현재 이용 중</CardTitle>
            <div className="flex gap-1">
              <BedDouble className="h-4 w-4 text-muted-foreground" />
              <Tent className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45 / 60</div>
            <p className="text-xs text-muted-foreground">객실 25, 사이트 20</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>예약 추이</CardTitle>
            <CardDescription>지난 7일간의 일별 예약 건수입니다.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <BookingChart />
          </CardContent>
        </Card>
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>빠른 작업</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Link href="/notices?new=true" passHref>
                <Button className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" /> 새 공지 작성
                </Button>
              </Link>
              <Link href="/gallery" passHref>
                <Button variant="outline" className="w-full bg-transparent">
                  <ImageIcon className="mr-2 h-4 w-4" /> 갤러리 바로가기
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>최근 활동</CardTitle>
                <CardDescription>최근 관리자 활동 내역입니다.</CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="#">
                  전체 보기
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src="/placeholder.svg?width=36&height=36" alt="Avatar" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">관리자 A</p>
                  <p className="text-sm text-muted-foreground">'여름맞이 특별 이벤트' 공지를 수정했습니다.</p>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">5분 전</div>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src="/placeholder.svg?width=36&height=36" alt="Avatar" />
                  <AvatarFallback>MG</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">매니저</p>
                  <p className="text-sm text-muted-foreground">김*수 님의 후기를 승인했습니다.</p>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">1시간 전</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
