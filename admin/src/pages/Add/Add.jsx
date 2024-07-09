import { useState } from "react";
import { assets } from "../../assets/assets";
import styles from "./Add.module.scss";
import axios from "axios";
import { toast } from "react-toastify";

const Add = () => {
  const url = "http://localhost:3000";
  const [image, setImage] = useState(false);

  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "salad",
  });

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("image", image);
    
    try {
      const response = await axios.post(`${url}/api/food/add`, formData);
      if (response.data.success) {
        setData({
          name: "",
          description: "",
          price: "",
          category: "salad",
        });
        setImage(false);
        toast.success(response.data.message)
      } else {
        console.error("Error adding food item:", response.data.message);
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      toast.error(error)
    }
  };

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  return (
    <div className={styles.container}>
      <form className={styles.flexcol} onSubmit={onSubmitHandler}>
        <div className={`${styles.imgupload} ${styles.flexcol}`}>
          <p>upload image</p>
          <label htmlFor="image">
            <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
          </label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            required
            hidden
            id="image"
          />
        </div>
        <div className={`${styles.name} ${styles.flexcol}`}>
          <p>product name</p>
          <input
            type="text"
            onChange={onChangeHandler}
            value={data.name}
            name="name"
            placeholder="type here"
          />
        </div>
        <div className={`${styles.description} ${styles.flexcol}`}>
          <p>product description</p>
          <textarea
            name="description"
            onChange={onChangeHandler}
            value={data.description}
            rows="6"
            placeholder="type here"
          />
        </div>
        <div className={styles.categoryprice}>
          <div className={`${styles.category} ${styles.flexcol}`}>
            <p>product category</p>
            <select name="category" onChange={onChangeHandler} value={data.category}>
              <option value="salad">salad</option>
              <option value="rolls">rolls</option>
              <option value="deserts">deserts</option>
              <option value="sandwich">sandwich</option>
              <option value="cake">cake</option>
              <option value="pure veg">pure veg</option>
              <option value="pasta">pasta</option>
              <option value="noodles">noodles</option>
            </select>
          </div>
          <div className={`${styles.price} ${styles.flexcol}`}>
            <p>product price</p>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="number"
              name="price"
              placeholder="$20"
            />
          </div>
        </div>
        <button type="submit">add</button>
      </form>
    </div>
  );
};

export default Add;
