/**
 * @file toggle.js
 *
 * Attaches the GDPR toggle function.
 */
(function ($, Drupal) {
  'use strict';

  // Borrowed from the top of eu_cookie_compliance/js/eu_cookie_compliance.js
  var cookieValueDisagreed = (typeof drupalSettings.eu_cookie_compliance.cookie_value_disagreed === 'undefined' || drupalSettings.eu_cookie_compliance.cookie_value_disagreed === '') ? '0' : drupalSettings.eu_cookie_compliance.cookie_value_disagreed;
  var cookieValueAgreed = (typeof drupalSettings.eu_cookie_compliance.cookie_value_agreed === 'undefined' || drupalSettings.eu_cookie_compliance.cookie_value_agreed === '') ? '2' : drupalSettings.eu_cookie_compliance.cookie_value_agreed;

  /**
   * A post status save handler for updating the value of our checkbox.
   *
   * @param {Object} response response from EU Cookie Compliance
   * @param {string} response.currentStatus current status from EU Cookie Compliance
   */
  var handlePostStatusSave = function (response) {
    // console.log('handlePostStatusSave', { response: response });
    var agreed = response.currentStatus !== cookieValueDisagreed;
    $('.tmt-eu-cookie-compliance-toggle').prop('checked', agreed);

    if (agreed) {
      $(window).trigger('enableCookies');
    }
    else {
      $(window).trigger('disableCookies');
    }
  };


  // Register our post status save handler with EU Cookie Compliance.
  Drupal.eu_cookie_compliance('postStatusSave', handlePostStatusSave);

  /**
  * A post status load handler for setting the initial cookie status on page load.
  *
  * @param {Object} response response from EU Cookie Compliance
  * @param {string} response.currentStatus current status from EU Cookie Compliance
  */
  var handlePostStatusLoad = function (response) {
    // console.log('handlePostStatusLoad', { response: response });
    var agreed = response.currentStatus !== cookieValueDisagreed;

    $(window).once('tmt-eu-cookie-compliance-handle-post-status-load').trigger(
      agreed ? 'enableCookies' : 'disableCookies'
    );
  };

  // Register our post status load handler with EU Cookie Compliance.
  Drupal.eu_cookie_compliance('postStatusLoad', handlePostStatusLoad);

  /**
   * Toggle the current status of the EU Cookie Compliance cookie.
   */
  var handleToggle = function () {
    var newStatus = Drupal.eu_cookie_compliance.getCurrentStatus() === cookieValueDisagreed ?
      cookieValueAgreed :
      cookieValueDisagreed;

    // console.log('setting newStatus to ', newStatus);

    Drupal.eu_cookie_compliance.changeStatus(newStatus);
  };

  Drupal.behaviors.tmt_eu_cookie_compliance_toggle = {
    attach: function (context) {
      $(context)
        .find('.tmt-eu-cookie-compliance-toggle')
        .once('tmt-eu-cookie-compliance-toggle')
        .on('click', handleToggle)
        .each(function () {
          $(this).prop('checked', Drupal.eu_cookie_compliance.getCurrentStatus() !== cookieValueDisagreed);
        });
    }
  };

})(jQuery, Drupal);
