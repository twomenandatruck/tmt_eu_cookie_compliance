<?php

namespace Drupal\tmt_eu_cookie_compliance\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Block\BlockPluginInterface;

/**
 * Provides a 'Toggle' block.
 *
 * @Block(
 *  id = "tmt_eu_cookie_compliance_toggle",
 *  admin_label = @Translation("Toggle"),
 * )
 */
class ToggleBlock extends BlockBase implements BlockPluginInterface {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $output = [];

    $output['button'] = [
      '#theme' => 'tmt_eu_cookie_compliance_toggle',
      // '#label' => 'I wish to opt in', // Default.
      // '#classes' => ['foo', 'bar'],
    ];

    return $output;
  }

}
