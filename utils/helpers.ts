export const truncate = (words: string, maxlength: number) => {
  return `${words.slice(0, maxlength)}...`
}