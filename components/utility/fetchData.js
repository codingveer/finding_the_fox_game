function shuffleArray(array) {
  return array.sort(function () {
    return Math.random() - 0.5;
  });
}

const fetchData = async () => {
  let imageUrls =[];
  const fetchWoflImage = fetch("https://randomfox.ca/floof/");
  let promiseCallApi = [];
  let ApiCalled =0;
  while(ApiCalled< 4) {
    promiseCallApi
    .push(
          fetch("https://api.thecatapi.com/v1/images/search"),
          fetch("https://dog.ceo/api/breeds/image/random")
    )
    ApiCalled+=1
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
    if(imageUrls.length>1){ shuffleArray([...imageUrls]);}
    return imageUrls
  } catch (e) {
    console.log(e);
  }
  //setLoading(false)
};


export  {fetchData, shuffleArray};