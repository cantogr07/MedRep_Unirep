import { faker } from '@faker-js/faker';

class GenerateNews {
    constructor(numArticles) {
      this.numArticles = numArticles
    }

    
  
    generate() {
      const articles = []
  
      for (let i = 0; i < this.numArticles; i++) {
        const article = {
          epochKey: faker.datatype.number(),
          created_at: faker.date.past(),
          objectID: i,
          title: faker.lorem.sentence(),
          upvotes: 0,
          downvotes: 0,
          demonstratedReputation: Math.floor((Math.random() * 40) + 30),
        }
        articles.push(article)
      }
  
      return articles
    }
  }
  
  export default GenerateNews;
  