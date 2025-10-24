/**
 * Size options for Avatar components.
 *
 * @remarks
 * - `iicon`: Extra small, icon size
 * - `ismall`: Small size
 * - `imedium`: Medium size
 * - `ilarge`: Large size
 */
export type Size = 'iicon' | 'ismall' | 'imedium' | 'ilarge';

/**
 * Menu orientation styles for layout rendering.
 *
 * @remarks
 * - `vertical`: Stacked menu items
 * - `horizontal`: Inline menu items
 */
export type MenuStyle = 'vertical' | 'horizontal';

/**
 * Menu sizing scale.
 *
 * @remarks
 * - `s`: Small size
 * - `m`: Medium size
 * - `l`: Large size
 */
export type MenuSize = 's' | 'm' | 'l';

/** Determines dropdown menu styling, allowing to toggle between dynamic
background colors (for user settings or pong backgrounds) or default colors.

@remarks
- `dynamic`: allows dynamic styling
- `static`: disallows dynamic styling
 */
export type DropdownBg = 'dynamic' | 'static';

/**
 * Relationship between viewer and a profile.
 *
 * @remarks
 * - `self`: Profile belongs to the viewer
 * - `friend`: Viewer is friends with the profile owner
 * - `pending`: Friend request pending
 * - `stranger`: No established relationship
 */
export type ProfileView = 'self' | 'friend' | 'pending' | 'stranger';

/**
 * Allowed font sizes for text styling.
 *
 * @remarks
 * - `t1`, `t2`, `t3`: Title sizes (largest to smallest)
 * - `f-s`, `f-m`, `f-l`: Font sizes small → large
 * - `f-regular`: Regular text size
 */
export type FontSize = 't1' | 't2' | 't3' | 'f-s' | 'f-m' | 'f-l' | 'f-regular';

/**
 * Font color style names used in UI themes.
 *
 * @remarks
 * - `f-yellow`: Yellow text color
 * - `f-orange`: Orange text color
 */
export type FontColor = 'f-yellow' | 'f-orange';

/**
 * Font weight options.
 *
 * @remarks
 * - `f-bold`: Bold font weight
 */
export type FontWeight = 'f-bold';

/**
 * HTML button type attribute values.
 *
 * @remarks
 * Matches native `<button type="...">` options.
 */
export type BtnType = 'button' | 'submit' | 'reset';
export type BtnStyles = 'green' | 'red';

export type GameType = '1 vs 1' | 'tournament';

/**
 * Metadata describing an HTML input field.
 *
 * @property labelContent - Visible text for the label element.
 * @property id - Unique identifier for the input element.
 * @property pattern - Regular expression string for validating input value.
 * @property placeholder - Placeholder hint text inside the input.
 * @property type - Input type attribute (`text`, `email`, etc.).
 * @property max - Optional, defines maximum numeric/date value.
 * @property min - Optional, defines minimum numeric/date value.
 * @property step - Optional, step size for increment/decrement.
 */
export interface InputFieldsData {
    id: string;
    labelContent: string;
    max?: string;
    min?: string;
    pattern: string;
    placeholder: string;
    step?: string;
    type: string;
}

/**
 * Image metadata for display elements.
 *
 * @property src - Image source URL.
 * @property id - Unique identifier for the image resource.
 * @property alt - Alt text for accessibility.
 * @property size - Predefined image size variant.
 */
export interface ImgMetadata {
    src: string;
    id: string;
    alt: string;
    size: Size;
}

/**
 * Button metadata used in UI rendering.
 *
 * @property type - Button functional type (`button`, `submit`, or `reset`).
 * @property content - Optional text content of the button.
 * @property img - Optional associated image metadata.
 * @property ariaLabel - Accessibility label for screen readers.
 */
export interface buttonData {
    type: BtnType;
    content: string | null;
    img: ImgMetadata | null;
    ariaLabel: string;
    style?: BtnStyles;
}

/**
 * Metadata describing a tab component.
 *
 * @property id - Unique tab identifier.
 * @property content - Visible text or HTML content within the tab.
 * @property default - Whether this is the default active tab on load.
 */
export interface TabData {
    id: string;
    content: string;
    default: boolean;
}

/**
 * User profile data model.
 *
 * @property avatar - User's avatar image metadata.
 * @property biography - Short biography text.
 * @property relation - Relationship between viewer and this user.
 * @property status - Boolean indicating online/offline status.
 * @property username - Display username.
 * @property id - Unique user identifier string.
 * @property winstreak - Current consecutive wins count (stringified).
 */
export interface UserData {
    avatar: ImgMetadata;
    biography: string;
    id: string;
    language: string;
    profileColor: string;
    relation: ProfileView;
    status: boolean;
    username: string;
    winstreak: string;
    since: string;
}

export interface formDetails {
    action: string;
    ariaLabel: string;
    button: buttonData;
    fields: InputFieldsData[];
    heading: string;
    id: string;
    method: string;
}

export interface inlineMatchResult {
    date: string;
    opponent: string;
    outcome: string;
    score: string;
    duration: string;
}
