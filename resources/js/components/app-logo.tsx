import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-end gap-2">
            <div className="flex aspect-square size-8 items-center bg-transparent justify-center rounded-md text-sidebar-primary-foreground">
                <img src="/logo_matictic.jpg" alt="" className="rounded-full"/>
            </div>
            <div className="ml-1 grid flex-1 text-left text-2xl">
                <span className="truncate leading-tight font-semibold">BDRS</span>
            </div>
        </div>
    );
}
