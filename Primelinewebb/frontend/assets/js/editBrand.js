(async () => {
  const brandId = window.location.pathname.split("/").pop();
  const fetchUrl = `/api/admin/brand-details/${brandId}`;
  const updateBrandUrl = `/api/admin/update-brand/${brandId}`;
  const updateCategoryUrl = `/api/admin/update-category`;
  const addCategoryUrl = `/api/admin/add-category/${brandId}`;

  const form = document.getElementById("brandDetailsForm");
  const categoryContainer = document.getElementById("categoryContainer");
  

  

  const populateForm = (data) => {
      document.getElementById("name").value = data.name;
      document.getElementById("tagline").value = data.tagline;
      document.getElementById("missionStatement").value = data.missionStatement;
      document.getElementById("coreValues").value = data.coreValues;
      document.getElementById("brandLogoImage").src=data.brandLogo;
      document.getElementById("brandImagesContainer").innerHTML=data.brandImages.map((data)=>{
          return  `
<div style="width: 100px;height: 100px; overflow: hidden;border-radius: 5px;margin-top: 10px;"><img src="${data.image}" style="width: 100%;height: 100%;object-fit: cover;" alt=""></div>
          `
      })
      document.getElementById("brandLogo").addEventListener("input", function (event) {
  const file = event.target.files[0]; // Get the selected file
  if (file) {
      const reader = new FileReader(); // Create a FileReader instance
      reader.onload = function (e) {
          document.getElementById("brandLogoImage").src = e.target.result; // Update the image source
      };
      reader.readAsDataURL(file); // Read the file as a data URL
  }
});
document.addEventListener("input", function (event) {
  if (event.target.name === "categories" && event.target.type === "file") {
      const file = event.target.files[0]; // Get the selected file
      if (file) {
          const reader = new FileReader(); // Create a FileReader instance
          reader.onload = function (e) {
              const imgContainer = event.target.closest(".category-item").querySelector("img");
              if (imgContainer) {
                  imgContainer.src = e.target.result; // Update the image source
              }
          };
          reader.readAsDataURL(file); // Read the file as a data URL
      }
  }
});
document.getElementById("brandImages").addEventListener("input", function (event) {
  const files = Array.from(event.target.files); // Get all selected files
  const container = document.getElementById("brandImagesContainer");

  container.innerHTML = ""; // Clear existing images

  if (files.length > 0) {
      files.forEach((file) => {
          const reader = new FileReader(); // Create a FileReader instance
          reader.onload = function (e) {
              // Create a new image container and append it
              const imgContainer = document.createElement("div");
              imgContainer.style.cssText = `
                  width: 100px;
                  height: 100px;
                  overflow: hidden;
                  border-radius: 5px;
                  margin-top: 10px;
              `;
              imgContainer.innerHTML = `<img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: cover;" alt="">`;
              container.appendChild(imgContainer);
          };
          reader.readAsDataURL(file); // Read the file as a data URL
      });
  }
});


      data.categories.forEach((category) => {
          const categoryItem = document.createElement("div");
          categoryItem.classList.add("category-item");
          categoryItem.innerHTML = `
              <input type="file" name="categories" data-category-id="${category._id}" class="form-control mb-2" />
              <input type="text" name="categoryCaption" class="form-control" placeholder="Caption" value="${category.caption}" />
               <div class="brandlogo-image-container" id="brandlogo-image-container">
                    <img src="${category.image}" id="categoryImage" alt="${category.caption}">

                      </div>
              <button type="button" class="btn btn-danger mt-2 btn-sm remove-category" data-category-id="${category._id}">Remove</button>
          `;
          categoryContainer.appendChild(categoryItem);
      });
  };

  const fetchBrandDetails = async () => {
      try {
          const response = await fetch(fetchUrl, { method: "GET" });
          const result = await response.json();

          if (result.success) {
              populateForm(result.brandDetails);
          } else {
              alert("Error fetching brand details: " + result.message);
          }
      } catch (error) {
          console.error("Error fetching brand details:", error);
      }
  };

  const addCategoryButton = document.getElementById("addCategoryButton");

  addCategoryButton.addEventListener("click", () => {
      const newCategoryInput = document.createElement("div");
      newCategoryInput.classList.add("category-item");
      newCategoryInput.innerHTML = `
          <input type="file" name="categories" class="form-control mb-2" />
          <input type="text" name="categoryCaption" class="form-control" placeholder="Caption" />
          <button type="button" class="btn btn-danger mt-2 btn-sm remove-category">Remove</button>
          <button type="button" class="btn btn-success mt-2 btn-sm add-category">Add</button>
      `;
      categoryContainer.appendChild(newCategoryInput);
  });

  const deleteCategory = async (catId) => {
      try {
          const response = await fetch(`/api/admin/delete-category/${brandId}/${catId}`, { method: "DELETE" });
          const result = await response.json();

          if (result.success) {
              const categoryItem = document.querySelector(`[data-category-id="${catId}"]`);
              window.location.reload()
              if (categoryItem) {
                  categoryItem.remove();

              }
          } else {
              console.error("Error deleting category:", result.message);
          }
      } catch (error) {
          console.error("Error deleting category:", error);
      }
  };

  const addNewCategory = async (categoryItem) => {
      const inputFile = categoryItem.querySelector('input[name="categories"]');
      const captionInput = categoryItem.querySelector('input[name="categoryCaption"]');

      const addedCategoryFormData = new FormData();
      addedCategoryFormData.append('caption', captionInput.value);

      if (inputFile.files.length > 0) {
          addedCategoryFormData.append('image', inputFile.files[0]);
      }

      try {
          const addCategoryResponse = await fetch(addCategoryUrl, {
              method: "POST",
              body: addedCategoryFormData,
          });

          const addCategoryResult = await addCategoryResponse.json();

          if (addCategoryResult.success) {
              // alert("Category added successfully");
              window.location.reload()
              // Optionally, you can update the UI or do something else here
              categoryItem.remove(); // Remove the category input after successful addition
          } else {
              console.error("Error adding new category:", addCategoryResult.message);
              alert("Failed to add category: " + addCategoryResult.message);
          }
      } catch (error) {
          console.error("Error adding new category:", error);
          alert("An error occurred while adding the category");
      }
  };

  form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(form);

      try {
          const updateBrandResponse = await fetch(updateBrandUrl, {
              method: "PATCH",
              body: formData,
          });

          const result = await updateBrandResponse.json();

          if (result.success) {
              const categories = Array.from(categoryContainer.children);
              const categoryUpdates = categories.map(async (category) => {
                  const inputFile = category.querySelector('input[name="categories"]');
                  const captionInput = category.querySelector('input[name="categoryCaption"]');
                  const categoryId = inputFile.getAttribute('data-category-id');
                  window.location.href=`/admin/admin-brand-details/${brandId}`
                  const categoryFormData = new FormData();
                  categoryFormData.append('caption', captionInput.value);

                  if (inputFile.files.length > 0) {
                      categoryFormData.append('image', inputFile.files[0]);
                  }

                  const updateCategoryResponse = await fetch(`${updateCategoryUrl}/${brandId}/${categoryId}`, {
                      method: "PATCH",
                      body: categoryFormData,
                  });

                  const categoryResult = await updateCategoryResponse.json();

                  if (!categoryResult.success) {
                      console.error(`Error updating category ${categoryId}:`, categoryResult.message);
                  }
              });

              await Promise.all(categoryUpdates);
              alert("Brand and category details updated successfully");
          } else {
              alert("Error updating brand details: " + result.message);
          }
      } catch (error) {
          console.error("Error updating brand details:", error);
      }
  });

  document.addEventListener('click', async (e) => {
      if (e.target && e.target.classList.contains('remove-category')) {
          const catId = e.target.getAttribute('data-category-id');
          if (catId) {
              await deleteCategory(catId);
          } else {
              // If it's a new, unsaved category, just remove it from the UI
              e.target.closest('.category-item').remove();
          }
      }

      if (e.target && e.target.classList.contains('add-category')) {
          const categoryItem = e.target.closest('.category-item');
          await addNewCategory(categoryItem);
      }
  });

  await fetchBrandDetails();
})();