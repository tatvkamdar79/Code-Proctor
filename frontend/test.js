// {
//   [
//     {
//         $lookUp:{

//         }
//     },
//     {
//       $unwind: "$items",
//     },
//     {
//         $group:{
//             "_id": "country",
//             total: {$sum: {$multiply: ["$items.quantity","$items.price"]}},
//             unique_products: {$addToSet: "$items.product_id"},

//         }
//     }
//   ];
// }

// {
//   [
//     {
//       $lookup: {
//         localField: "book_id",
//         foreignField: "_id",
//         from: "books",
//         as: "book",
//       },
//     },

//     { $unwind: "$book" },
//     {
//         $group:{
//             _id: "$book.genre",
//             numOfPosts: {$sum: 1},
//         }
//     },{
//         $sort:{
//             numOfPosts:-1,
//         }
//     },{
//         $limit: 5
//     }
//   ];
// }

// {
//     [
//         {

//         },
//         {
//             $group:{
//                 _id: "$customer_id",
//                 average: {$avg: "$total_amount"},
//             }
//         },
//         {
//             $sort:{
//                 average: -1,
//             }
//         },
//         {
//             $limit: 3
//         }
//     ]
// }

// {
//     [
//         {
//             $unwind: "$items",
//         },
//         {
//             $lookup:{
//                 from:"products",
//                 localField:"items.product_id", //$ here?
//                 foreignField:"_id",
//                 as:"product"
//             }
//         },
//         {
//             $unwind: "$product",
//         },
//         {
//             $group:{
//                 _id: "$product.category",
//                 totalSalesRevenue: {$sum: {$multiply: ["$product.price", "$items.quantity"]}}
//             }
//         }
//     ]
// }

[{}];
