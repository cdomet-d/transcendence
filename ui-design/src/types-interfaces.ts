/**
 * Defines size options for {@link Avatar}.
 */
export type Size = 'iicon' | 'ismall' | 'imedium' | 'ilarge';

/**
 * Defines menu orientation styles.
 */
export type MenuStyle = 'vertical' | 'horizontal';

/**
 * Describes the viewing relationship for a profile.
 */
export type ProfileView = 'self' | 'friend' | 'pending' | 'stranger';
/**
 * Represents allowed font size values for text elements.
 *
 * @remarks
 * - `t1`, `t2`, `t3`: Title sizes (largest to smallest)
 * - `f-s`, `f-m`, `f-l`: Font sizes (small, medium, large)
 * - `f-regular`: Regular font size
 */
export type FontSize = 't1' | 't2' | 't3' | 'f-s' | 'f-m' | 'f-l' | 'f-regular';

/**
 * Represents allowed font weight values for text elements.
 *
 * @remarks
 * - `f-bold`: Bold font weight
 */
export type FontWeight = 'f-bold';

export type BtnType = 'button' | 'submit' | 'reset';

/**
 * Represents the structure of an input field.
 *
 * @property {string} labelContent - Text for the input's label.
 * @property {string} id - Unique input element identifier.
 * @property {string} pattern - Regex pattern for input validation.
 * @property {string} placeholder - Placeholder text inside the input.
 * @property {string} type - Input type attribute (e.g., "text", "email").
 *
 * @example
 * const InputMetadata: InputMetadata = {
 *   labelContent: "Username",
 *   id: "username",
 *   pattern: "^[a-zA-Z0-9]{3,10}$",
 *   placeholder: "Enter your username",
 *   type: "text"
 * };
 */
export interface InputMetadata {
    labelContent: string;
    id: string;
    pattern: string;
    placeholder: string;
    type: string;
}

/**
 * An image's metadata.
 *
 * @property {string} src - The image's source URL.
 * @property {string} alt - The image's alt text.
 * @property {Size} size - The size of the image.
 */
export interface ImgMetadata {
    src: string;
    id: string;
    alt: string;
    size: Size;
}

/**
 * A button's metadata.
 *
 * @property {string} type - The button's type (`button` | `submit` | `reset`).
 * @property {string|null} content - The button's text content.
 * @property {ImgMetadata|null} img - Metadata for an associated image.
 * @property {string} ariaLabel - The button's aria-label for accessibility.
 *   See: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label
 */
export interface buttonData {
    type: BtnType;
    content: string | null;
    img: ImgMetadata | null;
    ariaLabel: string;
}

/**
 * Represents a tab with identifying data and display content.
 *
 * @property {string} id - The identifier for the tab. Must be unique.
 * @property {string} content - The visible text or content for the tab.
 * @property {boolean} default - Indicates the default tab to be displayed on page load. Should be unique, but if it's not, the default tab will be the first which has `default: true`.
 *
 * @example
 * const exampleTab: TabMetadata = {
 *   id: "home",
 *   content: "Home",
 *   default: true
 * };
 */
export interface TabMetadata {
    id: string;
    content: string;
    default: boolean;
}

/**
 * Describes user profile data.
 *
 * @property {string} avatar - The user's avatar image URL.
 * @property {string} biography - A short biography or description.
 * @property {string} memberSince - ISO formatted date when the user joined.
 * @property {boolean} relation - Relation between the viewing user and the created card.
 * @property {boolean} status - The user's current status (e.g., online/offline).
 * @property {string} username - The user's display username.
 * @property {string} userId - The user's id, associated to their card for selection purpose
 * @property {number} winstreak - The user's current winstreak count.
 */
export interface UserData {
    avatar: ImgMetadata;
    biography: string;
    relation: ProfileView;
    status: boolean;
    username: string;
    id: string;
    winstreak: string;
}
