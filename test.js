// const apiKey = "119e4079bc6fff48cb314dfdf4033e77";
// const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`;


// async function fetchdata(){
//     try{
//         let res = await fetch(url)
//         let result = await res.json()
//         console.log(result)
//     }
//     catch(error){
//         console.log("Error",error)
//     }
// }

// fetchdata()

function example() {
  const args = Array.prototype.slice.apply(arguments)
  console.log(args)
}

example(1, 2, 3)