/*
1. We’re creating a new Promise for each image.
2. We’re creating a new Image object for each image.
3. We’re setting the src property of the Image object to the src of the image.
4. We’re setting the onLoad event handler of the Image object to a function that resolves the Promise.
5. We’re setting the onError event handler of the Image object to a function that rejects the Promise.
*/
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