x = [
  {
    $unwind: "$items",
  },
  {
    $lookup: {
      from: "products",
      localField: "items.product_id",
      foreignFiled: "_id",
      as: "item",
    },
  },
  {
    $unwind: "item",
  },
  {
    $group: {
      _id: "$item.category",
      totalRevenue: { $multiply: ["$item.price", "$item.quantity"] },
    },
  },
];
