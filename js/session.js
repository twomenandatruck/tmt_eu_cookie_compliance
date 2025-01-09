/**
 * @file session.js
 *
 * GPC Implementation.
 */
(function ($, Drupal) {
  "use strict"

  // Respect GPC signal from browser unless overridden by user.
  $(function() {
    if (
      navigator.globalPrivacyControl &&
      localStorage.getItem('tmt_cookie_opt_out') !== '0'
      ) {
      Drupal.eu_cookie_compliance.declineAction();
    }
  });

})(jQuery, Drupal)
