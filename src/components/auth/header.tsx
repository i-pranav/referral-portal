import { cn } from "@/src/lib/utils"
import { Poppins } from "next/font/google"
import Logo from "../logo";

const font = Poppins({
    subsets: ['latin'],
    weight: ['600']
})


interface HeaderProps {
    label: string;
}

export const Header = ({ label }: HeaderProps) => {
    return (
        <div className="w-full flex flex-col gap-y-2 items-center justify-center">
            <div className="flex flex-row items-center">
                <Logo />
                <h1 className={
                    cn("text-3xl font-semibold", font.className)
                }>
                    ACD Referrer
                </h1>
            </div>

            <p className="text-foreground text-md">
                {label}
            </p>
        </div>
    )
}