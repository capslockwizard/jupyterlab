// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  JSONValue
} from '@phosphor/coreutils';

import {
  Widget
} from '@phosphor/widgets';


/**
 * A namespace for rendermime associated interfaces.
 */
export
namespace IRenderMime {
  /**
   * A bundle for mime data.
   */
  export
  interface IBundle {
    /**
     * Get a value for a given key.
     *
     * @param key - the key.
     *
     * @returns the value for that key.
     */
    get(key: string): JSONValue;

    /**
     * Set a key-value pair in the bundle.
     *
     * @param key - The key to set.
     *
     * @param value - The value for the key.
     *
     * @returns the old value for the key, or undefined
     *   if that did not exist.
     */
    set(key: string, value: JSONValue): JSONValue;

    /**
     * Check whether the bundle has a key.
     *
     * @param key - the key to check.
     *
     * @returns `true` if the bundle has the key, `false` otherwise.
     */
    has(key: string): boolean;

    /**
     * Get a list of the keys in the bundle.
     *
     * @returns - a list of keys.
     */
    keys(): string[];

    /**
     * Remove a key from the bundle.
     *
     * @param key - the key to remove.
     *
     * @returns the value of the given key,
     *   or undefined if that does not exist.
     */
    delete(key: string): JSONValue;
  }

  /**
   * An observable model for mime data.
   */
  export
  interface IMimeModel {
    /**
     * Whether the model is trusted.
     */
    readonly trusted: boolean;

    /**
     * The data associated with the model.
     */
    readonly data: IBundle;

    /**
     * The metadata associated with the model.
     */
    readonly metadata: IBundle;
  }

  /**
   * The options used to initialize a document widget factory.
   */
  export
  interface IWidgetFactoryOptions {
    /**
     * The file extensions the widget can view.
     *
     * #### Notes
     * Use "*" to denote all files. Specific file extensions must be preceded
     * with '.', like '.png', '.txt', etc.  They may themselves contain a
     * period (e.g. .table.json).
     */
    readonly fileExtensions: string[];

    /**
     * The name of the widget to display in dialogs.
     */
    readonly name: string;

    /**
     * The file extensions for which the factory should be the default.
     *
     * #### Notes
     * Use "*" to denote all files. Specific file extensions must be preceded
     * with '.', like '.png', '.txt', etc. Entries in this attribute must also
     * be included in the fileExtensions attribute.
     * The default is an empty array.
     *
     * **See also:** [[fileExtensions]].
     */
    readonly defaultFor?: string[];

    /**
     * Whether the widget factory is read only.
     */
    readonly readOnly?: boolean;

    /**
     * The registered name of the model type used to create the widgets.
     */
    readonly modelName?: string;

    /**
     * Whether the widgets prefer having a kernel started.
     */
    readonly preferKernel?: boolean;

    /**
     * Whether the widgets can start a kernel when opened.
     */
    readonly canStartKernel?: boolean;
  }

  /**
   * An interface for using a RenderMime.IRenderer for output and read-only documents.
   */
  export
  interface IExtension {
    /**
     * The MIME type for the renderer, which is the output MIME type it will handle.
     */
    mimeType: string;

    /**
     * A renderer class to be registered to render the MIME type.
     */
    renderer: IRenderer;

    /**
     * The index passed to `RenderMime.addRenderer`.
     */
    rendererIndex?: number;

    /**
     * The timeout after user activity to re-render the data.
     */
    renderTimeout?: number;

    /**
     * Preferred data type from the model.  Defaults to `string`.
     */
    dataType?: 'string' | 'json';

    /**
     * The icon class name for the widget.
     */
    iconClass?: string;

    /**
     * The icon label for the widget.
     */
    iconLabel?: string;

    /**
     * The options used for using the renderer for documents.
     */
    widgetFactoryOptions?: IWidgetFactoryOptions;
  }

  /**
   * The interface for a module that exports an extension or extensions as
   * the default value.
   */
  export
  interface IExtensionModule {
    /**
     * The default export.
     */
    default: IExtension | IExtension[];
  }

  /**
   * A widget that provides a ready promise.
   */
  export
  interface IReadyWidget extends Widget {
    /**
     * A promise that resolves when the widget is ready.
     */
    ready: Promise<void>;
  }

  /**
   * The interface for a renderer.
   */
  export
  interface IRenderer {
    /**
     * The mimeTypes this renderer accepts.
     */
    readonly mimeTypes: string[];

    /**
     * Whether the renderer can render given the render options.
     *
     * @param options - The options that would be used to render the data.
     */
    canRender(options: IRenderOptions): boolean;

    /**
     * Render the transformed mime data.
     *
     * @param options - The options used to render the data.
     */
    render(options: IRenderOptions): IReadyWidget;

    /**
     * Whether the renderer will sanitize the data given the render options.
     *
     * @param options - The options that would be used to render the data.
     */
    wouldSanitize(options: IRenderOptions): boolean;
  }

  /**
   * The options used to transform or render mime data.
   */
  export
  interface IRenderOptions {
    /**
     * The preferred mimeType to render.
     */
    mimeType: string;

    /**
     * The mime data model.
     */
    model: IMimeModel;

    /**
     * The html sanitizer.
     */
    sanitizer: ISanitizer;

    /**
     * An optional url resolver.
     */
    resolver?: IResolver;

    /**
     * An optional link handler.
     */
    linkHandler?: ILinkHandler;
  }

  /**
   * An object that handles html sanitization.
   */
  export
  interface ISanitizer {
    /**
     * Sanitize an HTML string.
     */
    sanitize(dirty: string): string;
  }

  /**
   * An object that handles links on a node.
   */
  export
  interface ILinkHandler {
    /**
     * Add the link handler to the node.
     */
    handleLink(node: HTMLElement, url: string): void;
  }

  /**
   * An object that resolves relative URLs.
   */
  export
  interface IResolver {
    /**
     * Resolve a relative url to a correct server path.
     */
    resolveUrl(url: string): Promise<string>;

    /**
     * Get the download url of a given absolute server path.
     */
    getDownloadUrl(path: string): Promise<string>;
  }
}
