export const truncate = (words: string, maxlength: number) => {
  return `${words.slice(0, maxlength)}...`
}

export const timeSince = (timestamp: Date) => {
  let now = new Date();
  let secondsPast = (now.getTime() - timestamp.getTime()) / 1000;
  if(secondsPast < 60) return Math.floor(secondsPast) + 's ago';
  if(secondsPast < 3600) return Math.floor(secondsPast/60) + 'mins ago';
  if(secondsPast <= 86400) return Math.floor(secondsPast/3600) + 'h';
  if(secondsPast <= 2628000) return Math.floor(secondsPast/86400) + 'd';
  if(secondsPast <= 31536000) return Math.floor(secondsPast/2628000) + 'mo';
  if(secondsPast > 31536000) return Math.floor(secondsPast/31536000) + 'y';
}