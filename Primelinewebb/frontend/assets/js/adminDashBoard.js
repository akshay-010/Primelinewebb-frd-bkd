/**
   * Apply .scrolled class to the body as the page is scrolled down
   */
function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

/**
   * Hide mobile nav on same-page/hash links
   */
document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }
//   dl


async function protection() {
    const adminToken = localStorage.getItem('adminJWT');
    if (!adminToken) {
        window.location.href = '/adminLogin';
        return;
    }

    try {
        // Fetch the logged-in user details
        const response = await fetch('/getLoginedUser', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${adminToken}`, // Pass the token in the Authorization header
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user details');
        }

        const userData = await response.json();

        // Display the user's name in the header
        const navMenu = document.getElementById('navmenu');
    } catch (error) {
        console.error('Error fetching logged-in user details:', error.message);
        alert('Error fetching user details. Please log in again.');
        localStorage.removeItem('adminJWT');
        window.location.href = '/adminLogin';
    }
}

// Call the protection function on page load
protection();
    function handleLogout() {
const confirmation = confirm("Are you sure you want to log out?");
if (confirmation) {
    localStorage.removeItem('adminJWT');
    window.location.href = '/adminLogin';
}
}

       
    // Delete brand by ID
    async function deleteBrand(brandId) {
        const confirmation = confirm("Are you sure you want to delete this brand?");
        if (!confirmation) return;

        try {
            const response = await fetch(`/api/admin/delete-brand/${brandId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error("Failed to delete brand");
            }

            const result = await response.json();

            if (result.success) {
                alert("Brand deleted successfully");
                // Remove the deleted brand from the DOM
                const brandCard = document.querySelector(`.delete-brand-btn[onclick="deleteBrand('${brandId}')"]`).closest('.col-md-4');
                // brandCard.remove();
                window.location.reload()
            } else {
                alert("Failed to delete brand: " + result.message);
            }
        } catch (error) {
            console.error('Error:', error.message);
            alert('Error deleting brand');
        }
    }
    // Fetch brand details from the server
    async function fetchBrands() {
        try {
            const response = await fetch('/api/admin/get-brand-details');
            if (!response.ok) {
                throw new Error('Failed to fetch brand details');
            }
            const brands = await response.json();
            displayBrands(brands);
        } catch (error) {
            console.error('Error:', error.message);
            alert('Error fetching brand details');
        }
    }

   
    // Display brands dynamically
    function displayBrands(brands) {
        const brandList = document.getElementById('brandList');
        brandList.innerHTML = ''; // Clear any existing content

        brands.forEach(brand => {
            const card = document.createElement('div');
            card.className = 'col-lg-3 col-md-4';
            card.innerHTML = `
              <div class="Brand1-item">
    <a href="${`/admin/admin-brand-details/${brand._id}`}">
        <img src="${brand.brandLogo || 'assets/img/placeholder.png'}" alt="${brand.name}" class="img-fluid"
             style="width: 70%; height: 200px; object-fit: cover; object-position: center; display: block; margin: 0 auto; padding-right: 20px;">
    </a>
</div>

            `;
            brandList.appendChild(card);
        });
    }

    // Call the fetch function on page load
    document.addEventListener('DOMContentLoaded', fetchBrands);

    document.addEventListener('DOMContentLoaded', () => {
fetchBrands();
fetchCoverPics(); // Fetch cover pictures on page load
});

async function fetchCoverPics() {
try {
    const response = await fetch('/api/admin/get-all-cover-pics', {
        method: 'GET', // Explicitly specify the GET method
        headers: {
            'Content-Type': 'application/json', // Optional, depending on your API setup
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch cover pictures');
    }
    const coverPicsJson = await response.json();
    const coverPics=coverPicsJson.coverPics
    
    displayCoverPics(coverPics);
     // Disable "Add Cover Pic" button if coverPics array length >= 1
     const addCoverPicButton = document.querySelector('a[href="/admin/add-cover-pick"]');
     if (coverPics.length >= 1) {
         addCoverPicButton.style.pointerEvents = 'none';
         addCoverPicButton.style.opacity = '0.6';
         addCoverPicButton.classList.add('disabled');
     } else {
         addCoverPicButton.style.pointerEvents = 'auto';
         addCoverPicButton.style.opacity = '1';
         addCoverPicButton.classList.remove('disabled');
     }
         // Add click event to display alert if button is disabled
         addCoverPicButton.addEventListener('click', function(event) {
            if (addCoverPicButton.classList.contains('disabled')) {
                alert('Only one cover pic can be added');
            }
        });
} catch (error) {
    console.error('Error fetching cover pictures:', error.message);
}
}

function displayCoverPics(coverPics) {
const coverPicList = document.getElementById('coverPicList');
coverPicList.innerHTML = ''; // Clear any existing content

coverPics.forEach(pic => {
    const card = document.createElement('div');
    card.className = 'col-lg-3 col-md-9 col-sm-10 col-10';
    card.innerHTML = `
<div class="card brand-card cover-pic-card">
<div class="card-body brand-card-body">
    <h5 class="brand-card-title">${pic.heading || 'No Title'}</h5>
    <p>${pic.subheading || ''}</p>
    <button class="btn btn-danger mt-3 delete-brand-btn" onClick="deleteCoverPic('${pic._id}')">Delete</button>
    <a href="/admin/edit-cover-pick/${pic._id}"><button class="btn btn-primary mt-3 delete-brand-btn">Edit</button></a>
</div>
</div>

`;
    coverPicList.appendChild(card);
});
}
async function deleteCoverPic(coverPicId) {
const confirmation = confirm("Are you sure you want to delete this cover picture?");
if (!confirmation) return;

try {
    const response = await fetch(`/api/admin/delete-coverPic/${coverPicId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error("Failed to delete cover picture");
    }

    const result = await response.json();

    if (result.success) {
        alert("Cover picture deleted successfully");
        // Remove the deleted cover picture from the DOM
        const coverCard = document.querySelector(`.delete-brand-btn[onClick="deleteCoverPic('${coverPicId}')"]`).closest('.card');
        coverCard.remove();
        window.location.reload()
    } else {
        alert("Failed to delete cover picture: " + result.message);
    }
} catch (error) {
    console.error('Error:', error.message);
    alert('Error deleting cover picture');
}
}
