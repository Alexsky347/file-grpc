function debounce(callback: () => void, delay: number): () => void {
    let timer: NodeJS.Timeout;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        callback();
      }, delay);
    };
  }

export { debounce };
