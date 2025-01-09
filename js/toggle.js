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
  var cookieValueDisagreed = (
    typeof drupalSettings.eu_cookie_compliance.cookie_value_disagreed === 'undefined' ||
    drupalSettings.eu_cookie_compliance.cookie_value_disagreed === ''
  ) ? '0' : drupalSettings.eu_cookie_compliance.cookie_value_disagreed;
  var cookieValueAgreedShowThankYou = (
    typeof drupalSettings.eu_cookie_compliance.cookie_value_agreed_show_thank_you === 'undefined' ||
    drupalSettings.eu_cookie_compliance.cookie_value_agreed_show_thank_you === ''
  ) ? '1' : drupalSettings.eu_cookie_compliance.cookie_value_agreed_show_thank_you;
  var cookieValueAgreed = (
    typeof drupalSettings.eu_cookie_compliance.cookie_value_agreed === 'undefined' ||
    drupalSettings.eu_cookie_compliance.cookie_value_agreed === ''
  ) ? '2' : drupalSettings.eu_cookie_compliance.cookie_value_agreed;

  var statusIsAgreed = function (status) {
    if (status !== null) {
      return [cookieValueAgreed, cookieValueAgreedShowThankYou].includes(status);
    }
    return drupalSettings.eu_cookie_compliance.method === 'opt_out';
  };

  /**
   * A post status save handler for updating the value of our checkbox.
   *
   * @param {Object} response response from EU Cookie Compliance
   * @param {string} response.currentStatus current status from EU Cookie Compliance
   */
  var handlePostStatusSave = function (response) {
    var isAgreed = statusIsAgreed(response.currentStatus);
    console.log('handlePostStatusSave', {
      response: response,
      isAgreed: isAgreed,
    });

    $(cookieCheckboxSelector).prop('checked', !isAgreed);

    $(window).trigger(
      isAgreed ? 'enableCookies' : 'disableCookies'
    );
  };

  /**
  * A post status load handler for setting the initial cookie status on page load.
  *
  * @param {Object} response response from EU Cookie Compliance
  * @param {string} response.currentStatus current status from EU Cookie Compliance
  */
  var handlePostPreferencesLoad = function (response) {
    var isAgreed = statusIsAgreed(response.currentStatus);
    console.log('handlePostPreferencesLoad', {
      response: response,
      isAgreed: isAgreed,
    });

    $(window).trigger(
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
          Drupal.eu_cookie_compliance.declineAction();
        }
        else {
          Drupal.eu_cookie_compliance.acceptAction();
        }
      };

      // Respect GPC signal from browser unless overridden by user.
      $(function() {
        if (
          navigator.globalPrivacyControl &&
          localStorage.getItem('tmt_cookie_opt_out') !== '0'
          ) {
          Drupal.eu_cookie_compliance.declineAction();
          $(cookieCheckboxSelector).prop('checked', true);
        }
      });

      $(once('tmt-eu-cookie-compliance-toggle', cookieCheckboxSelector, context))
        .on('change', handleToggle)
        .each(function () {
          // Initial status.
          $(this).prop('checked', !statusIsAgreed(Drupal.eu_cookie_compliance.getCurrentStatus()));
        });
    }
  };

})(jQuery, Drupal);
