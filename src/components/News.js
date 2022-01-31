import React, {useEffect , useState} from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from 'prop-types';


const News = (props) => {

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
 
  const capitalizeFirstLetter =(string)=> {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
  const updateNews = async(pageNo) => {
    props.setProgress(10)
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=b905920349874b91af5f859dc72978c5&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true)
    let data = await fetch(url);
    props.setProgress(30)
    let parsedData = await data.json();
    props.setProgress(60)
    setArticles(parsedData.articles)
    setTotalResults(parsedData.totalResults)
    setLoading(false)
    props.setProgress(100)
  }
  useEffect(() => {
     document.title = `${capitalizeFirstLetter(props.category)}-NewsPocket`
    updateNews()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePrevClick = async () => {
    setPage(page-1)
    updateNews()
  };
  const handleNextClick = async () => {
    setPage(page+1)
    updateNews()
    
  };
    return (
      <div className="container my-3">
      <h1 className="text-center" style={{margin: '20px 0px',marginTop :'80px'}}>News-Pocket Top Headlines on {capitalizeFirstLetter(props.category)}</h1>
      {loading && <Spinner/>}
        <div className="row">
          {!loading && articles.map((element) => {
            return (
              <div className="col-md-4" key={element.url}>
                <NewsItem
                  key={element.url}
                  title={element.title ? element.title.slice(0, 45) : ""}
                  description={
                    element.description ? element.description.slice(0, 88) : ""
                  }
                  imageUrl={element.urlToImage}
                  newsUrl={element.url}
                  author = {element.author}
                  date = {element.publishedAt}
                  name = {element.source.name}
                />
              </div>
            );
          })}
        </div>
        <div className="container d-flex justify-content-between">
          <button
            disabled={page <= 1}
            type="button"
            className="btn btn-dark my-4"
            onClick={handlePrevClick}
          >
            {" "}
            &larr;Prev
          </button>
          <button
            type="button"
            disabled={page+1>Math.ceil(totalResults/props.pageSize)}
            className="btn btn-warning my-4"
            onClick={handleNextClick}
          >
            Next &rarr;
          </button>
        </div>
      </div>
    );
  
}
News.defaultProps = {
    country: 'in',
    pageSize:5,
    category:'general'
  }
  News.propTypes = {
    country: PropTypes.string,
    pageSize:PropTypes.number,
    category : PropTypes.string
  }
export default News;
