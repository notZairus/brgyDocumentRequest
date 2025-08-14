import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-end gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary/10 text-sidebar-primary-foreground">
                
            </div>
            <div className="ml-1 grid flex-1 text-left text-2xl">
                <span className="truncate leading-tight font-semibold">BDRS</span>
            </div>
        </div>
    );
}
