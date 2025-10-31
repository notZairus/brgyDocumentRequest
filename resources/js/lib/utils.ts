import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Pagination, PaginationLink } from "@/types/index.d";


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


export function replacePaginationLink<T>(pagination: Pagination<T>, wordToBeReplace: string, wordToReplace: string): Pagination<T> {
    const data = pagination;

    const fixedLinks = data.links.map((link: PaginationLink, index: number) => {
        const newUrl = link.url ? link.url.replace(wordToBeReplace, wordToReplace) : null;
        return { ...link, url: newUrl }
    });

    const newPagination = {
        ...data,
        links: fixedLinks
    }

    return newPagination;
}


export function base64ToDocx(base64: string, filename = 'document.docx') {
  // Normalize and decode
    const byteCharacters = atob(base64); // decode Base64
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    return new File(
        [byteArray],
        filename,
        { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }
    );
}
