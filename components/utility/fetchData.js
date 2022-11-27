function shuffleArray(array) {
  return array.sort(function () {
    return Math.random() - 0.5;
  });
}

const getImageData = async () => {
  const fetchWoflImage = fetch("https://randomfox.ca/floof/");
  let promiseCallApi = [];
  const fetchCatImages = fetch("https://api.thecatapi.com/v1/images/search");
  const dogImage = fetch("https://dog.ceo/api/breeds/image/random");
  for (let i = 0; i < 4; i++) {
    promiseCallApi.push(fetch("https://api.thecatapi.com/v1/images/search"), fetch("https://dog.ceo/api/breeds/image/random"))
  }
  promiseCallApi.push(fetchWoflImage);
  //console.log(promiseCallApi, 'promiseCallApi')
  try {
    const awaitForPromise = await Promise.all(promiseCallApi);
    const getResponseFromAllApi = await Promise.all(
      awaitForPromise.map((res) => res.json())
    );
    let imageUrlsData = getResponseFromAllApi
      .flat()
      .map((data) => data.message || data.image || data.url);
    imageUrls = [...imageUrls, ...imageUrlsData];
    shuffleArray([...imageUrls]);
  } catch (e) {
    console.log(e);
  }
  //setLoading(false)
};


export default getImageData;