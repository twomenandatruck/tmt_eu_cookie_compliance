<?php

namespace Drupal\tmt_eu_cookie_compliance\Controller;

use Drupal\Core\Block\BlockManagerInterface;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Controller to serve cookie page content.
 */
class CookiePageController extends ControllerBase implements ContainerInjectionInterface {

  /**
   * The block plugin manager service.
   *
   * @var \Drupal\Core\Block\BlockManagerInterface
   */
  protected BlockManagerInterface $blockManager;

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    $controller = parent::create($container);
    $controller->blockManager = $container->get('plugin.manager.block');

    return $controller;
  }

  /**
   * Returns a renderable array for the cookie page.
   *
   * @return array
   *   The page render array.
   */
  public function content(): array {
    $toggle_block = $this->blockManager->createInstance('tmt_eu_cookie_compliance_toggle', []);

    return [
      // Page wrapper and libraries.
      '#type' => 'container',
      '#attributes' => [
        'class' => [
          'cookie-page-wrapper'
        ]
      ],
      '#attached' => [
        'library' => [
          'tmt_eu_cookie_compliance/toggle',
        ]
      ],
      // Body text.
      'body' => [
        '#type' => 'processed_text',
        '#text' => $this->config('tmt_eu_cookie_compliance.settings')->get('body_text.value') ?: $this->t(''),
        '#format' => $this->config('tmt_eu_cookie_compliance.settings')->get('body_text.format') ?: 'wysiwyg',
      ],
      // Toggle block.
      'toggle' => $toggle_block->build(),
    ];
  }

}
