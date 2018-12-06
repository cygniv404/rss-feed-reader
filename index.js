import './style';
import { Component } from 'preact';

class News {
	constructor(title,description,link,guid,category,creator,pubDate) {
		this.title = title
		this.description = description
		this.link = link
		this.guid = guid
		this.category = category
		this.creator = creator
		this.pubDate = pubDate

	}
}

export default class App extends Component {
	constructor() {
		super();
		this.state = {
			feed: []
		};
	}

	getnews(event) {
		event.preventDefault();
		const proxyurl = "https://cors-anywhere.herokuapp.com/";
		const request = new Request(proxyurl+event.target.elements.url.value);
		return fetch(request).then((results) => {
		  	results
		    .text()
		    .then(( str ) => {
		      let responseDoc = new DOMParser().parseFromString(str, 'application/xml');
					const newsItem = responseDoc.getElementsByTagName('item')
					let singleFeed=  {
						_number:newsItem.length,
						_date: new Date(),
						_news:[]

					}
					for (var i = 1; i < newsItem.length; i++) {
						 	var singleNews = new News()
						  singleNews.title =  responseDoc.getElementsByTagName('title')[i].textContent;
						  singleNews.description =  responseDoc.getElementsByTagName('description')[i].textContent;
						  singleNews.link =  responseDoc.getElementsByTagName('link')[i].textContent;
						  singleNews.guid =  responseDoc.getElementsByTagName('guid')[i].textContent;
						  singleNews.category =  responseDoc.getElementsByTagName('category')[i].textContent;
						  singleNews.creator =  responseDoc.getElementsByTagName('dc:creator')[i].textContent;
						  singleNews.pubDate =  responseDoc.getElementsByTagName('pubDate')[i].textContent;


						singleFeed._news.push(singleNews)

					}

					this.setState({feed: singleFeed })
		    })
			.catch((error) => console.log(error))
		  })

	}

	render() {
		const { feed } = this.state;
		return (

			<div>

			<form onSubmit={this.getnews.bind(this)}>
			<input type="text" name="url" placeholder="url" />
			<input type="submit" value="get news"/>
			</form>

			<div>
			{
				feed._number && (
					<div>
					<p stwle={{fontSize: "medium", color: "steelblue"}}>{feed._number} Feeds</p>
					<p>{"Last Sync: " + feed._date.getDate() + "/"
                + (feed._date.getMonth()+1)  + "/"
                + feed._date.getFullYear() + " @ "
                + feed._date.getHours() + ":"
                + feed._date.getMinutes() + ":"
                + feed._date.getSeconds()} </p>
					</div>
				)
			}
			</div>

			{


				feed._news && (
					feed._news.map((_singleNews) =>{
						return(
						<div class="news">
						<h1 style={{margin:0}}>{_singleNews.category}</h1>
						<p style={{paddingLeft:"10px",fontSize:"20px",color:"blue"}}>{_singleNews.title}</p>
						<p>{_singleNews.description}</p>
						<a href={_singleNews.link} target="_blank">{_singleNews.link}</a>
						<p style={{color:"gray"}}>{_singleNews.creator} {_singleNews.pubDate}</p>
						</div>

					)})

				)

			}

			</div>
		);
	}
}
