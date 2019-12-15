$(".save").on("click", function() {
    let thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/saved/" + thisId
    }).then(data => {
        window.location = "/"
    })
});


$(".delete").on("click", function() {
    let thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/delete/" + thisId
    }).then(data => {
        window.location = "/"
    })
});


$("#scrape").on("click", () => {
    $.ajax({
        method: "GET",
        url: "/scraped",
    }).then(data => {
        console.log(data)
        window.location = "/"
    })
});


$(".save-note").on("click", function() {
    let thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
          body: $("#noteText" + thisId).val()
        }
      }).then(data => {
          console.log(data);
          $("#noteText" + thisId).val("");
          $(".modalNote").modal("hide");
          window.location = "/saved"
    });
});


$(".deleteNote").on("click", function() {
    let thisId = $(this).attr("data-note-id");
    $.ajax({
        method: "POST",
        url: "/deleteNote/" + thisId,
      }).then(data => {
          console.log(data);
          window.location = "/saved"
        })
})