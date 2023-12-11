import { useEffect } from 'react';

export default function useScrollToLast(
  showTime: boolean | number | undefined,
  ref: any
) {
  const scrollToBottom = () => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [showTime]);
}
