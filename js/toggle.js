/**
 * @file toggle.js
 *
 * Attaches the GDPR toggle function.
 */
(function ($, Drupal) {
  'use strict';

  // Sep up the namespace as a function to store list of arguments in a queue.
  Drupal.eu_cookie_compliance = Drupal.eu_cookie_compliance || function() {
    (Drupal.eu_cookie_compliance.queue = Drupal.eu_cookie_compliance.queue || []).push(arguments)
  };

  // Initialize the object with some data.
  Drupal.eu_cookie_compliance.a = +new Date;

  var cookieCheckboxSelector = '.tmt-eu-cookie-compliance-toggle input[type="checkbox"]';

  // Borrowed from the top of eu_cookie_compliance/js/eu_cookie_compliance.js
  var cookieValueDisagreed = (typeof drupalSettings.eu_cookie_compliance.cookie_value_disagreed === 'undefined' || drupalSettings.eu_cookie_compliance.cookie_value_disagreed === '') ? '0' : drupalSettings.eu_cookie_compliance.cookie_value_disagreed;
  var cookieValueAgreedShowThankYou = (typeof drupalSettings.eu_cookie_compliance.cookie_value_agreed_show_thank_you === 'undefined' || drupalSettings.eu_cookie_compliance.cookie_value_agreed_show_thank_you === '') ? '1' : drupalSettings.eu_cookie_compliance.cookie_value_agreed_show_thank_you;
  var cookieValueAgreed = (typeof drupalSettings.eu_cookie_compliance.cookie_value_agreed === 'undefined' || drupalSettings.eu_cookie_compliance.cookie_value_agreed === '') ? '2' : drupalSettings.eu_cookie_compliance.cookie_value_agreed;

  var statusIsAgreed = function (status) {
    return (status !== null && [cookieValueAgreed, cookieValueAgreedShowThankYou].includes(status)) || drupalSettings.eu_cookie_compliance.method === 'opt_out';
  };

  /**
   * A post status save handler for updating the value of our checkbox.
   *
   * @param {Object} response response from EU Cookie Compliance
   * @param {string} response.currentStatus current status from EU Cookie Compliance
   */
  var handlePostStatusSave = function (response) {
    console.log('handlePostStatusSave', { response: response });
    var isAgreed = statusIsAgreed(response.currentStatus);
    $(cookieCheckboxSelector).prop('checked', isAgreed);

    $(window).trigger(isAgreed ? 'enableCookies' : 'disableCookies');
  };

  /**
  * A post status load handler for setting the initial cookie status on page load.
  *
  * @param {Object} response response from EU Cookie Compliance
  * @param {string} response.currentStatus current status from EU Cookie Compliance
  */
  var handlePostPreferencesLoad = function (response) {
    console.log('handlePostPreferencesLoad', { response: response });
    var isAgreed = statusIsAgreed(response.currentStatus);

    $(window).once('tmt-eu-cookie-compliance-handle-post-status-load').trigger(
      isAgreed ? 'enableCookies' : 'disableCookies'
    );
  };

  // Register our post status save handler with EU Cookie Compliance.
  Drupal.eu_cookie_compliance('postStatusSave', handlePostStatusSave);

  // Register our post status load handler with EU Cookie Compliance.
  Drupal.eu_cookie_compliance('postPreferencesLoad', handlePostPreferencesLoad);

  Drupal.behaviors.tmt_eu_cookie_compliance_toggle = {
    attach: function (context) {
      /**
       * Toggle the current status of the EU Cookie Compliance cookie.
       */
      var handleToggle = function (event) {
        if (event.target.checked) {
          Drupal.eu_cookie_compliance.acceptAction();
        }
        else {
          Drupal.eu_cookie_compliance.declineAction();
        }
      };

      $(context)
        .find(cookieCheckboxSelector)
        .once('tmt-eu-cookie-compliance-toggle')
        .on('change', handleToggle)
        .each(function () {
          // Initial status.
          $(this).prop('checked', statusIsAgreed(Drupal.eu_cookie_compliance.getCurrentStatus()));
        });
    }
  };

})(jQuery, Drupal);
