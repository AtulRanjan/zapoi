function toDoulbeDigitNumber(number){
  if(number < 10){
    number = '0' + number;
  }
  return number;
}

$(document).ready(function(){
  $('.slider').slider({
    range: true,
    min: 0,
    max: 28*60,
    values: [ 10*60, 18*60 ],
    create: function(event, ui){
      var day = $(this)[0].id.split('-')[1];

      var open = '10:00';
      var close = '18:00';
      $( "#" + day + '-hours-open' ).val(open);
      $( "#" + day + '-hours-close' ).val(close);
    },
    slide: function( event, ui ) {
      var day = $(this)[0].id.split('-')[1];

      var open = toDoulbeDigitNumber(Math.floor(ui.values[0]/60)) + ':' + toDoulbeDigitNumber(ui.values[0]%60);
      var close = toDoulbeDigitNumber(Math.floor(ui.values[1]/60)) + ':' + toDoulbeDigitNumber(ui.values[1]%60);
      $( "#" + day + '-hours-open' ).val(open);
      $( "#" + day + '-hours-close' ).val(close);
    }
  });

  $('form').on('submit', function (e) {
    console.log(e)
  })
})