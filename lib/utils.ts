import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function mapColorToHex(colorName: string): string {
  const lowerColor = colorName.toLowerCase().replace(/\s+/g, "")
  const colorMap: { [key: string]: string } = {
    black: "#000000",
    white: "#FFFFFF",
    gray: "#808080",
    red: "#FF0000",
    blue: "#0000FF",
    green: "#008000",
    navy: "#000080",
    khaki: "#F0E68C",
    olive: "#808000",
    lightblue: "#add8e6",
    darkgreen: "#006400",
  }
  return colorMap[lowerColor] || lowerColor
}
