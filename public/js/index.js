/*!
 * Start Bootstrap - Agnecy Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
  $('.page-scroll').bind('click', function(event) {
      var $anchor = $(this);
      $('html, body').stop().animate({
          scrollTop: $($anchor.attr('href')).offset().top
      }, 1500, 'easeInOutExpo');
      event.preventDefault();
  });

  // JS to send Contact Us email
  $("#contactForm input, #contactForm textarea").jqBootstrapValidation({
      preventSubmit: true,
      submitError: function(event, errors) {
          // additional error messages or events
      },
      submitSuccess: function($form, event) {
          event.preventDefault(); // prevent default submit behaviour
          // get values from FORM
          var name = $("#contactForm input#name").val();
          var email = $("#contactForm input#email").val();
          var phone = $("#contactForm input#phone").val();
          var message = $("#contactForm textarea#message").val();
          var firstName = name; // For Success/Failure Message
          // Check for white space in name for Success/Fail message
          if (firstName.indexOf(' ') >= 0) {
              firstName = name.split(' ').slice(0, -1).join(' ');
          }
          $.ajax({
              url: "/contact_us",
              type: "POST",
              data: {
                  name: name,
                  phone: phone,
                  email: email,
                  message: message
              },
              cache: false,
              success: function() {
                  // Success message
                  $('#contactForm #success').html("<div class='alert alert-success'>");
                  $('#contactForm #success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                      .append("</button>");
                  $('#contactForm #success > .alert-success')
                      .append("<strong>Your message has been sent. </strong>");
                  $('#contactForm #success > .alert-success')
                      .append('</div>');

                  //clear all fields
                  $('#contactForm #contactForm').trigger("reset");
              },
              error: function() {
                  // Fail message
                  $('#contactForm #success').html("<div class='alert alert-danger'>");
                  $('#contactForm #success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                      .append("</button>");
                  $('#contactForm #success > .alert-danger').append("<strong>Sorry " + firstName + ", it seems that my mail server is not responding. Please try again later!");
                  $('#contactForm #success > .alert-danger').append('</div>');
                  //clear all fields
                  $('#contactForm').trigger("reset");
              },
          })
      },
      filter: function() {
          return $(this).is(":visible");
      },
  });

  $("a[data-toggle=\"tab\"]").click(function(e) {
      e.preventDefault();
      $(this).tab("show");
  });

  $('#signUpForm #join').click(function(e){
    e.preventDefault();
    var data = $('form#signUpForm').serializeObject();
    console.log(data);
    $.ajax({
      url: '/user/create',
      type: 'POST',
      data: data,
      success: function(data){
          window.location.href = '/user/edit';
      },
      error: function(err){
          console.log('failed: ', err);
      }
    })
  })

  $('form#top-search .input-daterange')
    .datepicker({
      autoclose: true
    });
});

// Highlight the top nav as scrolling occurs
$('body').scrollspy({
  target: '.navbar-fixed-top'
})

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
  $('.navbar-toggle:visible').click();
});

/*When clicking on Full hide fail/success boxes */
$('#name').focus(function() {
  $('#success').html('');
});

