import "./CreateFish.css";

import axiosInstance from "../axiosInstance";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreateFish = () => {
  const navigate = useNavigate();
  const [pools, setPools] = useState([]);
  const [fishData, setFishData] = useState({
    poolId: 0,
    name: "",
    image: "",
    size: 0,
    weight: 0,
    dob: "",
    gender: "Male",
    origin: "",
    foodName: "",
    foodWeight: 0,
  });

  const userId = JSON.parse(localStorage.getItem("userId"));
  const memberId = userId ? userId : 0;

  useEffect(() => {
    if (memberId !== 0) {
      fetchPoolsForMember(memberId);
    }
  }, [memberId]);

  const fetchPoolsForMember = (memberId) => {
    axiosInstance
      .get("https://koicareapi.azurewebsites.net/api/Pool?page=1&pageSize=100")
      .then((res) => {
        const memberPools = res.data.filter(
          (pool) => pool.memberId === memberId
        );
        setPools(memberPools);
      })
      .catch((err) => {
        console.error("Error fetching pools data:", err);
        toast.error("Failed to fetch pools data.", { autoClose: 1500 });
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFishData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newFood = {
      name: fishData.foodName.trim(),
      weight: Number(fishData.foodWeight),
    };

    try {
      const foodResponse = await axiosInstance.post(
        "https://koicareapi.azurewebsites.net/api/Food/add",
        newFood,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const foodId = foodResponse.data.id;

      const newFish = {
        poolId: Number(fishData.poolId),
        foodId: foodId,
        name: fishData.name.trim(),
        image:
          fishData.image.trim() ||
          "https://png.pngtree.com/thumb_back/fw800/background/20231221/pngtree-red-koi-carp-in-water-photo-image_15554800.png",
        size: Number(fishData.size),
        weight: Number(fishData.weight),
        gender: fishData.gender,
        origin: fishData.origin.trim(),
        dob: fishData.dob ? new Date(fishData.dob).toISOString() : null,
      };

      await axiosInstance.post(
        "https://koicareapi.azurewebsites.net/api/Fish/add",
        newFish,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Fish created successfully!", { autoClose: 1500 });
      navigate("/fishmanagement");
    } catch (error) {
      if (error.response) {
        console.error("Error response from API:", error.response.data);
        toast.error(
          `Failed to create fish. Status: ${
            error.response.status
          }. Errors: ${JSON.stringify(error.response.data.errors)}`,
          { autoClose: 1500 }
        );
      } else if (error.request) {
        console.error("Error request:", error.request);
        toast.error("Failed to create fish. No response from server.", {
          autoClose: 1500,
        });
      } else {
        console.error("Error message:", error.message);
        toast.error(`Failed to create fish. Error: ${error.message}`, {
          autoClose: 1500,
        });
      }
    }
  };

  return (
    <div>
      <CreateFishForm
        fishData={fishData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        pools={pools}
      />
    </div>
  );
};

function CreateFishForm({ fishData, handleChange, handleSubmit, pools }) {
  const handleFocus = (e) => {
    if (e.target.value === "0") {
      e.target.value = ""; // Clear the input value if it's '0'
    }
  };

  return (
    <form className="form_fish" onSubmit={handleSubmit}>
      <p className="form_title">Create Fish</p>

      <div className="form_grid_fish">
        <div className="column">
          <div className="input_infor">
            <label>Fish Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter fish name"
              value={fishData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input_infor">
            <label>
              Pool:
              <span className="dropdown-arrow"> ▼</span>
            </label>
            <select
              name="poolId"
              value={fishData.poolId}
              onChange={handleChange}
              className="custom-select"
              required
            >
              <option value="0">Select a pool</option>
              {pools.map((pool) => (
                <option key={pool.id} value={pool.id}>
                  {pool.name}
                </option>
              ))}
            </select>
          </div>

          <div className="input_infor">
            <label>Gender:</label>
            <select
              name="gender"
              value={fishData.gender}
              onChange={handleChange}
              className="custom-select"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="input_infor">
            <label>Origin:</label>
            <input
              type="text"
              name="origin"
              placeholder="Enter origin"
              value={fishData.origin}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input_infor">
            <label>Image (optional):</label>
            <input
              type="text"
              name="image"
              placeholder="Image URL (optional)"
              value={fishData.image}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="column">
          <div className="input_infor">
            <label>Size:</label>
            <input
              type="number"
              name="size"
              placeholder="Enter size"
              value={fishData.size}
              onChange={handleChange}
              onFocus={handleFocus} // Add onFocus handler
              required
            />
          </div>

          <div className="input_infor">
            <label>Weight:</label>
            <input
              type="number"
              name="weight"
              placeholder="Enter weight"
              value={fishData.weight}
              onChange={handleChange}
              onFocus={handleFocus} // Add onFocus handler
              required
            />
          </div>

          <div className="input_infor">
            <label>Food Name:</label>
            <input
              type="text"
              name="foodName"
              placeholder="Enter food name"
              value={fishData.foodName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input_infor">
            <label>Food Weight:</label>
            <input
              type="number"
              name="foodWeight"
              placeholder="Enter food weight"
              value={fishData.foodWeight}
              onChange={handleChange}
              onFocus={handleFocus} // Add onFocus handler
              required
            />
          </div>

          <div className="input_infor">
            <label>Date of Birth (DOB):</label>
            <input
              type="date"
              name="dob"
              value={fishData.dob}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>

      <div className="buttons">
        <button type="submit">Save</button>
        <button type="button" onClick={() => window.history.back()}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default CreateFish;
