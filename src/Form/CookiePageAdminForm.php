<?php

namespace Drupal\tmt_eu_cookie_compliance\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Class CookiePageAdminForm.
 */
class CookiePageAdminForm extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'tmt_eu_cookie_compliance.settings',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'srm_cookie_page_admin_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('tmt_eu_cookie_compliance.settings');

    $form['body_text'] = [
      '#type' => 'text_format',
      '#title' => 'Body Text',
      '#format' => 'wysiwyg',
      '#default_value' => $config->get('body_text.value'),
    ];

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $config = $this->config('tmt_eu_cookie_compliance.settings');
    $config->set('body_text', $form_state->getValue('body_text'));
    $config->save();

    parent::submitForm($form, $form_state);
  }

}
