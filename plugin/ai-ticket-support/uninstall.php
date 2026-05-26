<?php
/**
 * Runs when the plugin is deleted (not just deactivated).
 * Drops all custom tables and removes plugin options.
 */
declare(strict_types=1);

defined('WP_UNINSTALL_PLUGIN') || exit;

global $wpdb;

$tables = [
    $wpdb->prefix . 'ats_messages',
    $wpdb->prefix . 'ats_tickets',
    $wpdb->prefix . 'ats_saved_answers',
    $wpdb->prefix . 'ats_categories',
];

foreach ($tables as $table) {
    // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
    $wpdb->query("DROP TABLE IF EXISTS `{$table}`");
}

delete_option('ats_settings');
delete_option('ats_db_version');
