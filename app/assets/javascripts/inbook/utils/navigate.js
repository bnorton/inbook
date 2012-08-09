inbook.utils.navigate = function(url, new_tab) {
  if(!new_tab) {
    window.location.href = url;
  } else {
    window.open(url, '_blank');
  }
};
