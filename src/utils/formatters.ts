export const formatTimeAgo = (dateStr: string): string => {
  if (!dateStr) return 'unknown time';
  const date = new Date(dateStr);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

export const getDocType = (mimeType: string): 'pdf' | 'md' | 'image' | 'code' | 'other' => {
  if (!mimeType) return 'other';
  const lower = mimeType.toLowerCase();
  if (lower.includes('pdf')) return 'pdf';
  if (lower.includes('markdown') || lower.includes('md')) return 'md';
  if (lower.includes('image')) return 'image';
  if (lower.includes('json') || lower.includes('javascript') || lower.includes('java') || lower.includes('code')) return 'code';
  return 'other';
};
