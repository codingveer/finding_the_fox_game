const cacheImages = async (srcArray: string[]) => {

  const promises = srcArray.map((src) => {
    return new Promise<void>((resolve, reject) => {
      // const img = <Image src={src}
      //   onLoad={() => resolve()} />;
      const img: any = new Image();
      img.src = src;
      img.onload = resolve();
      img.onnerror = reject();
    });
  });
}
export { cacheImages };