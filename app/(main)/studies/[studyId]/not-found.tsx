import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/config/routes";

// 상세 화면에서 notFound()가 불리면 page 대신 이 화면이 나와요.
export default function StudyNotFound() {
  return (
    <div className="flex flex-col items-center gap-2 py-16 text-center">
      <p className="font-medium">스터디를 찾을 수 없어요</p>
      <p className="text-sm text-muted-foreground">
        지워졌거나 주소가 잘못됐을 수 있어요.
      </p>
      <Link
        href={routes.studies}
        className={buttonVariants({ variant: "outline", className: "mt-2" })}
      >
        목록으로
      </Link>
    </div>
  );
}
