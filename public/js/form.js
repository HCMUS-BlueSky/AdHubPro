// Select option
document
  .querySelector(".report-modal")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    let type = "ads";
    let name = document.querySelector("#name").value;
    let email = document.querySelector("#email").value;
    let phone = document.querySelector("#phone").value;

    let method = document.querySelector('input[name="method"]:checked').value;
    let content = tinymce.get("report-content").getContent();
    let location = "65367cb86989f834e0a2e7a9";
    let ads = "6537cabd7a255635c0e645d2";

    const data = {
      type,
      name,
      email,
      phone,
      method,
      content,
      location,
      ads,
    };

    console.log(data);

    // const formData = new FormData(e.target);
    try {
      const response = await fetch("api/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Report submitted successfully!");
      } else {
        const errorMessage = await response.text();
        console.error("Error:", errorMessage);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
