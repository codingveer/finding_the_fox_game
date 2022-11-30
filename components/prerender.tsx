import Image from 'next/image';
/*
1. creating a new Promise for each image.
2. creating a new Image object for each image.
3. setting the src property of the Image object to the src of the image.
4. setting the onLoad event handler of the Image object to a function that resolves the Promise 
   and downloads image in browser to cache the image for better user experience.
5. setting the onError event handler of the Image object to a function that rejects the Promise.
*/
const cacheImages = async (srcArray: string[]) => {

  const promises = srcArray.map((src) => {
    return new Promise<void>((resolve, reject) => {
      const img = <Image src={src}onLoad={() => resolve()} alt='' />;
    });
  });
}
export { cacheImages };