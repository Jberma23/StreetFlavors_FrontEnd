import React, { Component } from 'react';
import { Form, TextArea, Rating, Button, List } from 'semantic-ui-react'
import { Link } from "react-router-dom"
class CustTruck extends Component {
    constructor(props) {
        super(props);
        this.state = {
            favorites: props.currentUser.favorites,
            commentClicked: false,
            favoriteClicked: false
        }

    }

    // componentDidMount(){
    //     this.props.currentUser.favorites
    //     this.setState({favorites: [...this.state.ratings]})
    // }
    handleComment = () => {

    }

    handleFavoriteClick = (event, truck) => {
        this.props.handleFavorite(event, this.props.truck);
        this.setState({ favoriteClicked: !this.state.clicked })
    }

    render() {

        return (

            <div className="ui card" style={{ marginLeft: "4%", marginRight: "0%", width: "100%" }}  >
                <div className="scrolling content">
                    <div className="left floated meta" id="price">{this.props.truck.price}</div>

                    {this.props.currentUser.favorites.map((f) => { return f.favorited_id }).includes(this.props.truck.id) ?

                        <>
                            <div className="right floated meta">Favorite  <i id="fullheart" className="heart icon" onClick={(event, truck) => this.props.handleFavoriteDelete(event, this.props.truck)}></i></div>
                        </>
                        :
                        <>
                            <div className="right floated meta">Favorite  <i id="heart" className="heart outline icon" onClick={(event, truck) => this.handleFavoriteClick(event, this.props.truck)}></i></div>
                        </>
                    }
                    <>
                        {this.props.truck.name}
                    </>
                </div>

                <div className="image">
                    <img src={this.props.truck.image_url} alt={this.props.truck.name} />
                </div>
                <div className="content">
                    {/* <i id="star" className="star icon"></i> */}
                    {this.props.truck.ratings.length >= 1 ?
                        <span className="right floated">
                            Average Rating: <br />

                            <Rating maxRating={5} defaultRating={this.props.truck.rating} icon='star' disabled />
                            <br />
                            Rate:   <br />
                            <Rating maxRating={5} icon='star' defaultRating={this.props.truck.ratings[0].score} clearable onRate={(e, { rating, maxRating }) => this.props.handleRate(e, { rating, maxRating }, this.props.truck)} />
                        </span>
                        :
                        <span className="right floated">
                            Average Rating: <br />
                            <Rating maxRating={5} defaultRating={this.props.truck.rating} icon='star' disabled />
                            <br />
                            Rate:   <br />
                            <Rating maxRating={5} icon='star' clearable onRate={(e, { rating, maxRating }) => this.props.handleRate(e, { rating, maxRating }, this.props.truck)} />
                        </span>
                    }
                    {/* // <span className="right floated">

                        // </span> */}

                    {this.state.commentClicked ?
                        <>
                            <span className="left floated"> <i id="review" className="comment icon" onClick={(event) => this.setState({ commentClicked: !this.state.commentClicked })} ></i>
                                Reviews: {this.props.truck.reviews.length + this.props.truck.review_count}</span>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            <span className="center">
                                <Form onSubmit={(event) => { this.props.handleCommentSubmit(event, this.props.truck) }}>
                                    <TextArea placeholder='Leave a Comment Here' style={{ width: "100%" }} />
                                    <Button type='submit' >Submit</Button>
                                </Form>
                            </span>
                            <br></br>
                            <span>
                                <ul>
                                    {this.props.truck.reviews.map((r) =>
                                        <List key={r.id}>
                                            <List.Item>
                                                <List.Icon name='comment' />
                                                <List.Content>
                                                    <List.Header as='a'>
                                                        <i className="user outline icon"></i>
                                                        {r.username}</List.Header>
                                                    <List.Description>{r.content}
                                                    </List.Description>
                                                </List.Content>
                                            </List.Item>
                                        </List>
                                    )}

                                </ul>
                            </span>
                        </>

                        :
                        <span className="left floated"> <i id="review" className="comment icon" onClick={(event) =>
                            this.setState({ commentClicked: !this.state.commentClicked })}
                        ></i>
                            Reviews: {this.props.truck.reviews.length + this.props.truck.review_count}</span>

                    }


                </div>
                <div className="extra content">
                    <div className="ui large transparent left icon input">
                        {/* <i className="heart outline icon"></i> */}
                        <Link to={'/orders'} ><button type="">Order</button></Link>
                    </div>

                    <div>

                    </div>
                </div>
            </div>


        )
    }
}

export default CustTruck;