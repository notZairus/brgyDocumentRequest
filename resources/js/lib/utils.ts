import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}


export function imgToBase64(img: File) {
    return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result as string)
        }

        reader.readAsDataURL(img);
    }); 
}


export function base64ToBlob(base64: string): Blob {
    const [prefix, base64Data] = base64.split(',');
    const mime = prefix.match(/:(.*?);/)?.[1] || '';
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);

    return new Blob([byteArray], { type: mime });
}


export function base64ToFile(base64: string, filename: string): File {
  const [prefix, base64Data] = base64.split(',');
  const mime = prefix.match(/:(.*?);/)?.[1] || 'image/jpeg';
  const byteString = atob(base64Data);
  const byteArray = new Uint8Array(
    [...byteString].map(char => char.charCodeAt(0))
  );
  return new File([byteArray], filename, { type: mime });
}
