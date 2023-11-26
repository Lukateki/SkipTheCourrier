class ReviewCatalog {
    static _instance;

    static get_instance(){
        if (!ReviewCatalog._instance){
            ReviewCatalog._instance = new ReviewCatalog();
        }
        return ReviewCatalog._instance;
    }

    constructor() {
        if (ReviewCatalog._instance) {
            throw new Error("Singleton class, use getInstance method.")
        }
        this._reviews = new Map();
    }

    addReview(orderID, rating, comment){
        let review = new Review(orderID, rating, comment);
        this._reviews.set(orderID, review);
        return review;
    }

    getReview(reviewID) {
        if (!this._reviews.get(reviewID)){
            throw new Error("Invalid Review! Review not Found.");
        }
        return this._reviews.get(reviewID);
    }

    removeReview(reviewID){
        if (!this._reviews.get(reviewID)){
            throw new Error("Invalid Review! Review not Found.");
        }
        let review = this._reviews.get(reviewID);
        this._reviews.delete(reviewID);
        return review;
    }

    serialize(){
        const serializedReviews = Array.from(this._reviews.values(), review => review.serialize());
        return JSON.stringify({
            reviews: serializedReviews,
        });
    }

    deserialize(jsonString) {
        const data = JSON.parse(jsonString);
        const deserializedReviews = data.reviews.map(reviewData => Review.deserialize(reviewData));

        this._reviews = new Map(deserializedReviews.map(review => [review.getID(), review]));
    }
}

class Review{
    constructor(id, rating, comment){
        this._id = id;
        this._rating = rating;
        this._comment = comment;
    }
    getID(){
        return this.id;
    }
    getRating(){
        return this._rating;
    }
    getComment(){
        return this._comment;
    }
    setRating(rating){
        this._rating = rating;
    }
    setComment(comment){
        this._comment = comment;
    }

    serialize() {
        return JSON.stringify({
            id: this._id,
            rating: this._rating,
            comment: this._comment,
        })
    }

    static deserialize(jsonString){
        const data = JSON.parse(jsonString);
        const review = new Review(data.id, data.rating, data.comment);
        return review;
    }
}