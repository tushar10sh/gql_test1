const express = require('express');
const expressGraphQL = require('express-graphql');
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require('graphql');
const app = express();

const authors = [
	{ id: 1, name: 'J. K. Rowling' },
	{ id: 2, name: 'J. R. R. Tolkien' },
	{ id: 3, name: 'Brent Weeks' }
];

const books = [
	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
	{ id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
	{ id: 5, name: 'The Two Towers', authorId: 2 },
	{ id: 6, name: 'The Return of the King', authorId: 2 },
	{ id: 7, name: 'The Way of Shadows', authorId: 3 },
	{ id: 8, name: 'Beyond the Shadows', authorId: 3 }
];

const BookType = new GraphQLObjectType({
    name: "Book",
    description: "This represent a book written by an author",
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLInt)
        },
        name: {
            type: GraphQLNonNull(GraphQLString)
        },
        authorId: {
            type: GraphQLNonNull(GraphQLInt)
        },
        author: {
            type: AuthorType,
            resolve: (book) => {
                return authors.find( (author) => author.id === book.authorId)
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: "Author",
    description: "This represents an Author",
    fields: {
        id: {
            type: GraphQLNonNull(GraphQLInt)
        },
        name: {
            type: GraphQLNonNull(GraphQLString)
        },
        books: {
            type: GraphQLList(BookType),
            resolve: (author) => {
                return books.filter( (book) => {
                    return book.authorId === author.id
                })
            } 
        }
    }
});

const  RootQueryType = new GraphQLObjectType({
    name: 'RootQuery',
    description: "This is the Root Query",
    fields: () => ({
        books: {
            type: GraphQLList(BookType),
            description: "List of Books",
            resolve: () => books
        },
        authors: {
            type: GraphQLList(AuthorType),
            description: "List of Authors",
            resolve: () => authors
        },
        book: {
            type: BookType,
            description: "Single Book",
            args: {
                id: {
                    type: GraphQLInt
                }
            },
            resolve: (parent, args) => {
                return books.find( (book) => book.id === args.id );
            }
        },
        author: {
            type: AuthorType,
            description: "Single Author",
            args: {
                id: {
                    type: GraphQLInt
                }
            },
            resolve: (parent, args) => {
                return authors.find( (author) => author.id === args.id );
            }
        }
    })
});

const schema = new GraphQLSchema({
    query: RootQueryType
})
app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}));
app.listen(5000, () => {
    console.log('server listening on port 5000');
});