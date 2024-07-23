# BCGov Block Theme support scripts and styles 
## Provides supplemental features

This allows for vanilla CSS and Javascript development by providing unprocessed assets that can be uploaded as Asset Loader additions to the Media Library and enqueued to either the public facing or admin environment. 

The intent of which is to be used for lightweight additions to styles or DOM manipulation that is beyond the scope of what WordPress itself can manage inside the core block theme environment. While CSS can be included via the "Additional CSS" feature inside the Full Site Editor Styles inspector, this method has the added benefit of client-side file caching and front-end feature enhancement that would otherwise require inclusion at the theme or plugin level.

## Use case for this approach

Despite its extensive features, WordPress's default capabilities may need augmentation for accessibility purposes. Accessibility ensures that all users, including those with disabilities, can access and navigate websites effectively. The default WordPress capabilities in conjunction with a site's implementation may not fully comply with Web Content Accessibility Guidelines (WCAG), potentially leading to barriers for users with visual, auditory, cognitive, or motor impairments. Enhancing WordPress's accessibility often involves using specialized plugins, custom themes, and adherence to best practices in web design and development to provide an inclusive experience for all users. This includes augmenting features for keyboard navigation, screen reader support, color contrast adjustments, and text resizing options.

The [wildfireready-supplimental.js](https://github.com/codewisenate/wildfire-ready/blob/main/wildfireready-supplimental.js) script in this repository improves the website's accessibility by making the video feature adhere to WCAG standards and enhances the context for screen reader support. Features that could not be accomplished using WordPress in an editorial-only approach.

## How to use on testing or production

- Adding scripts and styles to a BCGov Block Theme site is accomplished by uploading compiled/transpiled CSS and/or JavaScript to the Media Library and enqueing through the "Attachment Details" modal.
- Required plugins: both the **BCGov Allow Javascript** and **BCGov Assets Loader** must be enabled for this feature to fully work. 
- CSS and JavaScript files can be enqueued for Public or Admin side using the checkboxes that are exposed via the BCGov Assets Loader plugin. If this plugin is enabled and you do not see these options, you will need an admin to enable your user account for this feature.
- In your user profile you will need to see the **asset-loader** listed under "Additional Capabilities" – if you do not see this, you will not be able to enqueue additional scripts or styles.