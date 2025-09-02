import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <div {...props} viewBox="0 0 40 42" xmlns="http://www.w3.org/2000/svg">
            <img src="/logo_matictic.jpg" alt="" className="rounded-full"/>
        </div>
    );
}
