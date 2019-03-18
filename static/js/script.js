$(document).ready(function() {
  $('.edit-form').on('submit', function(e) {
    console.log('working!!')
    e.preventDefault();
    var updatedInfo = $(this).serialize();
    var url = $(this).attr('action');
    console.log('submittttttt')
    $.ajax({
      method: "PUT",
      url: url,
      data: updatedInfo
    }).done(function(data) {
      console.log(data);
      window.location = '/articles';
    });
  });

  $('a.delete').on('click', function(e) {
    e.preventDefault();
    var url = $(this).attr('href');
    $.ajax({
      method: "DELETE",
      url: url
    }).done(function(data) {
      console.log(data);
      window.location = '/articles';
    });
  });
});
