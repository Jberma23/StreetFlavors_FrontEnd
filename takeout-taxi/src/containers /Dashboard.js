import React, { Component } from 'react';

import CustomerContainer from "./Customers/CustomersContainer"
import OwnersContainer from "./Owners/OwnersContainer"


class DashBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: props.user,
            trucks: [],
            searchTerm: "",
            favorited: [],
            favoriteTrucks: []
        }
    }
    getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.showPosition);
        } else {
            console.log("Geolocation is not supported by this browser.")
        }
    }
    showPosition = (position) => {
        this.setState({
            currentUser: {
                ...this.state.currentUser,
                longitude: position.coords.longitude, latitude: position.coords.latitude
            }

        })
    }


    componentDidMount() {
        fetch("http://localhost:3000/trucks")
            .then(res => res.json())
            .then(data => { this.setState({ trucks: data }) })
            .catch(e => console.error(e))

    }

    handlePinClick = (event, truck) => {
        console.log(truck)

    }
    handleSearch = (event) => {
        this.setState({ searchTerm: event.target.value })
    }
    handleFavorite = (event, truck) => {
        fetch('http://localhost:3000/favorites', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: 'application/json'
            },
            body: JSON.stringify({
                favoriter_id: this.state.currentUser.id,
                favorited_id: truck.id,
            })
        })
            .then(response => response.json())
            .then(res => this.setState({
                currentUser: {
                    ...this.state.currentUser,
                    favorites: { ...this.state.currentUser.favorites, res }
                },
                favoriteTrucks: [...this.state.favoriteTrucks, res.favorited_id]
            }))
    }
    handleRate = (e, { rating, maxRating }, truck) => {
        this.state.currentUser.ratings.includes(truck.id) ?
            fetch(`http://localhost:3000/rating/${truck.rating.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Accept: 'application/json'
                },
                body: JSON.stringify({
                    rater_id: this.state.currentUser.id,
                    rated_id: truck.id,
                    score: rating
                })
            }).then(response => console.log(response))
            :
            fetch('http://localhost:3000/ratings', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: 'application/json'
                },
                body: JSON.stringify({
                    rater_id: this.state.currentUser.id,
                    rated_id: truck.id,
                    score: rating
                })
            })
                .then(response => console.log(response))
    }
    handleCommentChange = (event, truck) => {
        this.setState({ comment: event.target.value })

    }
    handleCommentSubmit = (event, truck) => {
        this.state.currentUser.reviews.includes(truck.id) ?
            fetch(`http://localhost:3000/reviews/${truck.review.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Accept: 'application/json'
                },
                body: JSON.stringify({
                    reviewer_id: this.state.currentUser.id,
                    reviewed_id: truck.id,
                    content: this.state.comment,
                    username: this.state.currentUser.username
                })
            }).then(response => this.setState({
                currentUser: {
                    ...this.state.currentUser,
                    reviews: { ...this.state.currentUser.reviews, response }
                }
            }))
            :
            fetch('http://localhost:3000/reviews', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: 'application/json'
                },
                body: JSON.stringify({
                    reviewer_id: this.state.currentUser.id,
                    reviewed_id: truck.id,
                    content: this.state.comment,
                    username: this.state.currentUser.username
                })
            })
                .then(response => this.setState({
                    currentUser: {
                        ...this.state.currentUser,
                        reviews: { ...this.state.currentUser.reviews, response }
                    }
                }))


    }









    render() {
        return (
            this.state.currentUser.role === "customer" ?
                <div>
                    {this.getLocation()}
                    <CustomerContainer handleSearch={this.handleSearch} currentUser={this.state.currentUser} searchTerm={this.state.searchTerm}
                        handleCommentSubmit={this.handleCommentSubmit}
                        handleCommentChange={this.handleCommentChange}
                        handleRate={this.handleRate}
                        apiKey={this.props.apiKey}
                        handleUserLogOut={this.props.handleUserLogOut}
                        handleFavorite={this.handleFavorite}
                        filteredTrucks={this.state.trucks.filter((truck) => truck.name.includes(this.state.searchTerm))} handlePinClick={this.handlePinClick} trucks={this.state.trucks} favoriteTrucks={this.state.favoriteTrucks} />
                </div>
                :
                <div>
                    {this.getLocation()}
                    <OwnersContainer state={this.state} handleSearch={this.handleSearch}
                        apiKey={this.props.apiKey} handleUserLogOut={this.props.handleUserLogOut} currentUser={this.state.currentUser} searchTerm={this.state.searchTerm}
                        trucks={this.state.trucks.filter((truck) => truck.name.includes(this.state.searchTerm))} handlePinClick={this.handlePinClick} />

                </div>

        );
    }
}

export default DashBoard;