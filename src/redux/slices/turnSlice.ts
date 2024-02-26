import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {}

// export const fetchBook = createAsyncThunk(
//     'books/fetchBook',
//     async (url: string, thunkAPI) => {
//         try{
//             const res = await axios.get(url)
//             return res.data
//         } catch (e: any) {
//             thunkAPI.dispatch(setError(e.message))
//             return thunkAPI.rejectWithValue(e)
//         }
//     }
// )

const turnSlice = createSlice({
    name: 'turn',
    initialState,
    reducers: {
        // addBook: (state: BooksState, action) => {
        //     return {...state, books: [...state.books, action.payload]}
        // },
        // removeBook: (state, action) => {
        //     return {...state, books: state.books.filter((book: Book) => book.id !== action.payload)}
        // },
        // favoriteBook: (state: BooksState, action) => {
        //     return {
        //         ...state,
        //         books: state.books.map((book: Book) => {
        //             if (book.id === action.payload) {
        //                 return {
        //                     ...book,
        //                     favorite: !(book.favorite)
        //                 }
        //             }
        //             return book
        //         })
        //     }
        // },
        // clearBooks: (state) => {
        //     return {
        //         ...state,
        //         books: []
        //     }
        // }
    },
    extraReducers: (builder) => {
        // builder.addCase(fetchBook.pending, (state: BooksState) => {
        //     return {...state, isLoadingViaAPI: true}
        // })
        // builder.addCase(fetchBook.fulfilled, (state: BooksState, action) => {
        //     const {payload} = action
        //     if (payload?.title && payload?.author) {
        //         const {title, author} = payload
        //         return {...state, isLoadingViaAPI: false, books: [...state.books, createBook(title, author, "API")]}
        //     } else {
        //         return {...state, isLoadingViaAPI: false}
        //     }
        // })
        // builder.addCase(fetchBook.rejected, (state: BooksState) => {
        //     return {...state, isLoadingViaAPI: false}
        // })
    }
})

export default turnSlice.reducer;

// export const {
//     addBook,
//     removeBook,
//     favoriteBook,
//     clearBooks,
// } = bookSlice.actions

// export const selectIsLoading = (state: {books: BooksState}) => state.books.isLoadingViaAPI